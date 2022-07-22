# import numpy as np
from datetime import datetime
from os import remove
import requests
import flask
from sqlalchemy import *
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, history
from flask_cors import CORS
from flask_login import LoginManager

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "super-secret"
jwt = JWTManager(app)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://spot:metadon@147.232.24.160:49153/smart-space-dev'

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Camera(db.Model):
    __tablename__ = 'camera'

    id = db.Column(db.Integer, primary_key=True)
    ip_address = db.Column(db.String)
    name = db.Column(db.String())
    location = db.Column(db.String())
    who_reset_last = db.Column(db.String)
    last_reset_date = db.Column(db.DateTime)

    def __init__(self, name, ip_address, location):
        self.name = name
        self.ip_address = ip_address
        self.location = location

    def __repr__(self):
        return f"<Camera {self.name}>"

# @app.get(rule)



@app.route("/api/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # print(email)
    # print(password)

    if email != "test" or password != "test":
        return jsonify({"msg": "Bad username or password"}), 401
        # return flask.abort(401)
    else:
        access_token = create_access_token(identity=email)
        # pars = user_identity_loader(access_token)
        print(f'sending token: {access_token}')
        return jsonify(access_token=access_token, status=200) 

@app.route("/api/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@app.route('/api/camera', methods=['POST', 'GET'])
def handle_cams():
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            new_cam = Camera(name=data['name'], ip_address=data['ip_address'], location=data['location'])
            db.session.add(new_cam)
            db.session.commit()
            return {"message": f"camera {new_cam.name} has been created successfully."}
        else:
            return {"error": "The request payload is not in JSON format"}

    elif request.method == 'GET':
        cams = Camera.query.all()
        results = [
            {
                "id" : cam.id,
                "name": cam.name,
                "ip_address": cam.ip_address,
                "location": cam.location,
                "status" : check_status(cam.ip_address)
            } for cam in cams]

        return jsonify(results)


@app.route('/api/camera/<int:identifier>', methods=['GET'])
def handle_cam(identifier):
    # return specifi camera from DB - camera by id
    # also call enpoint GET http://{{ip}}/cgi-bin/admin/setparam.cgi 
    # if code 200 camera is UP else camera is down -> is_up = True / Flase
    
    cam = Camera.query.filter_by(id = identifier).first()
    
    res = {
        "id" : cam.id,
        "name" : cam.name,
        "ip_address" : cam.ip_address,
        "location" : cam.location,
        "status" : check_status(cam.ip_address)
    }

    return jsonify(res)

@app.route('/api/camera/<int:identifier>/ax_move/<int:res_x>&<int:res_y>&<int:vid_x>&<int:vid_y>', methods=['GET'])
def move_by_axis(identifier, res_x, res_y, vid_x, vid_y):
    #http://147.232.24.185/cgi-bin/camctrl/camctrl.cgi?video=0&x=258&y=219&resolution=1280x800&videosize=1280x800&stretch=1

    # moves specified camera (identifier)
    # at the specified coordinates
    # 'sizes' are used for... [preventing memory leak... sorry, i forgot:)]
    cam = Camera.query.filter_by(id = identifier).first()
    sizes = [1280, 800, 320, 200, 640, 400]

    if check_status(cam.ip_address) == 'online':
        if vid_x and vid_y in sizes:
            if res_x <= vid_x and res_y <= vid_y:
                print(cam.ip_address)
                requests.get("http://%s/cgi-bin/camctrl/camctrl.cgi?video=0&x=%d&y=%d&resolution=1280x800&videosize=%dx%d&stretch=1" %(cam.ip_address, res_x, res_y, vid_x, vid_y))
            else: return {"error" : f"sizes {res_x}x{res_y} are bad"}
        else: return {"error" : f"videosize {vid_x}x{vid_y} is wrong"}
    else: return {"error" : f"camera {identifier} is offline"}
    
    return {"Request URL" : "http://%s/cgi-bin/camctrl/camctrl.cgi?video=0&x=%d&y=%d&resolution=1280x800&videosize=%dx%d&stretch=1" %(cam.ip_address, res_x, res_y, vid_x, vid_y),
            "Request Method" : "GET",
            "Status Code" : 200}



@app.route('/api/camera/<int:identifier>/move/<string:direction>', methods=['GET'])
def turn_cam(identifier, direction):
    # move specify camera by id
    # get IP of camera from DB by id
    # call endpoint from camera http://{{ip}}/cgi-bin/camctrl/camctrl.cgi?move="direction"
    # control {direction} only possible movement
    
    cam = Camera.query.filter_by(id = identifier).first()
    directions = ['left', 'right', 'up', 'down', 'home']
    zooms = ['wide', 'tele']

    if check_status(cam.ip_address) == 'online':
        if direction in directions:
            requests.get("http://%s/cgi-bin/camctrl/camctrl.cgi?move=%s" %(cam.ip_address, direction))
        elif direction in zooms:
            requests.get("http://%s/cgi-bin/camctrl/camctrl.cgi?video=0&zoom=%s" %(cam.ip_address, direction))
        else: return {"error" : f"unknown direction {direction}"}
    else: return {"error" : f"camera {identifier} is offline"}

    response = {
        "Request URL" : "http://%s/cgi-bin/camctrl/camctrl.cgi?move=%s" %(cam.ip_address, direction),
        "Request Method" : "GET",
        "Status Code" : 200
    }

    return jsonify(response)


@app.route('/api/camera/<int:identifier>/reset', methods=['POST'])
def cam_reset(identifier):
    # call api POST `http://{{ip}}/cgi-bin/admin/getparam.cgi`
    # write to DB camera date to last_reset 
    # write to DB camera userid to who_last_reset (no priority)

    cam = Camera.query.filter_by(id = identifier).first()
    request_body = {"system_reset" : 1}

    if check_status(cam.ip_address) == 'online':
        requests.post("http://%s/cgi-bin/admin/setparam.cgi" %cam.ip_address, data = request_body)
        cam.last_reset_date = datetime.now()
        cam.who_reset_last = request.remote_addr
        db.session.commit()
        return {"message" : f"camera {identifier} restarted"}
    else: return {"error" : f"camera {identifier} is offline"}


def check_status(ip):
    if requests.get("http://%s/cgi-bin/admin/setparam.cgi" %ip).status_code == 200:
        return "online"
    else:
        return "offline"

# import api.views