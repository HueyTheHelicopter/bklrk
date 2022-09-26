import requests
from time import sleep
import cv2
import json
from uuid import uuid4
from datetime import datetime as dt
from models import Cameras, User, CamPreset
from __init__ import create_app, db, login_manager, server_session

from flask import jsonify, request, make_response, Response, session

from flask_jwt_extended import create_access_token, get_jwt, jwt_required, get_jwt_identity

from flask_login import (current_user, login_required,
                         login_user, logout_user,
                         confirm_login, fresh_login_required)

app = create_app()

@app.route("/api/getPresets", methods=["GET"])
def getPresets():
    presets = CamPreset.query.all()

    for preset in presets:
        moveset = preset.moveset
        moves = jsonifyMoves(moveset)
        preset.moveset = moves

    results = [
        {
            "id" : preset.id,
            "p_name" : preset.name,
            "p_bearer" : preset.bearer,
            "moveset" : preset.moveset,
        } for preset in presets
    ]

    return jsonify(results)

@app.route("/api/delOneMove", methods=["POST"])
def delOneMove():
    p_id = request.json.get("p_id", None)
    preset = CamPreset.query.filter_by(id = p_id).first()

    if not preset:
        return jsonify(error = "No preset found")
    else:
        moveset = preset.moveset
        m_id = request.json.get("m_id", None)
        moves = jsonifyMoves(moveset)
        ms = moves.pop(m_id)
        moves = stringifyMoveset(moves)
        preset.moveset = moves
        db.session.commit()
        return jsonify(msg = "move {m_id} was successfully deleted", status = 200)

@app.route("/api/stringMoveset", methods=["GET"])
def getMovesetString():
    h_id = request.headers.get("id", None)
    preset = CamPreset.query.filter_by(id = h_id).first()

    data = {
        "p_name" : preset.name,        
        "moveset" : preset.moveset
    }

    return jsonify(msg = 'OK!', status = 200, data = data)

@app.route("/api/delPreset", methods=["POST"])
def delPreset():
    p_bearer = request.json.get("p_bearer", None)
    p_name = request.json.get("p_name", None)
    res = CamPreset.query.filter_by(bearer = p_bearer).filter_by(name = p_name).delete()
    db.session.commit()
    return jsonify(msg = "preset was deleted", status = 200)

@app.route("/api/presetNameCheck", methods=["POST"])
def presetNameCheck():
    p_name = request.json.get("p_name", None)
    p_bearer = request.json.get("p_bearer", None)

    p_bearer = p_bearer.lower()
    table_name = CamPreset.__tablename__

    if p_name:
        existing_preset = CamPreset.query.filter(CamPreset.name == p_name, 
                                                 CamPreset.bearer == p_bearer).first()
        if existing_preset:
            return jsonify(error = f"{p_name} alredy exists, pick new one", status = 422)
        else:
            return jsonify(msg = "Now put some moves innit", status = 200)
    else:
        return jsonify(error = "Preset name missing", status = 401)

@app.route("/api/savePreset", methods=["POST"])
def save_preset():
    p_name = request.json.get("p_name", None)
    moveset = request.json.get("moveset", None)

    p_exists = CamPreset.query.filter_by(name = p_name).first()

    if p_exists:
        p_exists.moveset = moveset
        db.session.commit()
        return jsonify(msg = 'preset successfully updated', status = 200)
    else:
        p_bearer = request.json.get("p_bearer", None)
        
        p_bearer = p_bearer.lower()
        table_name = CamPreset.__tablename__

        new_preset = CamPreset(
            id = get_uuid(),
            name = p_name,
            bearer = p_bearer,
            moveset = moveset
        )

        db.session.add(new_preset)
        db.session.commit()

        return jsonify(msg = "Preset was created successfully!",
                    status = 200)
        
@app.route('/api/executePreset', methods=["GET"])
def exec_preset():
    p_name = request.headers.get("p_name", None)

    if p_name[:-1] == ' ':
        p_name = p_name.replace(" ", "")

    preset = CamPreset.query.filter_by(name = p_name).first()
    

    if not preset:
        return jsonify(msg = "Preset was not found",
                       status = 401)
    else:
        moveset = preset.moveset
        moveset = moveset[:-2] + ""
        moveset = moveset.split(",")
        print(moveset)
        print(type(moveset))
        print(moveset[-1])

        home = False
        is_moved = []

        for move in moveset:
            cam_id, direction = move.split("|")
            print("cam_id: " + cam_id + "\ndirection: " + direction)

            if cam_id not in is_moved:
                print(cam_id + " wasn't moved, set to 'home' ")
                is_moved.append(cam_id)
                home = False

            if not home:
                turn_home(cam_id)
                home = True
            
            sleep(1)
            
            response = turn_cam(cam_id, direction)
            
            if response.status != '200 OK':
                return jsonify(msg = "Something is went wrong!",
                               status = 401)
            

        is_moved.clear()
        return jsonify(msg = p_name + " was executed",
                       status = 200)

@app.route("/api/registrate", methods=["POST"])
def register():
    username = request.json.get("username", None)
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    repeat_password = request.json.get("repeat_password", None)

    # print("User attempting to registrate!")
    # print(f"Username is: {username}")z
    # print(f"E-mail is: {email}")
    # print(f"Password is: {password}")
    # print(f"R! Password is: {repeat_password}")

    if password != repeat_password:
        return jsonify(error = "Passwords aren't the same", login = False, status = 401)
    elif username and email:
        existing_user = User.query.filter(User.username == username or User.email == email).first()
        if existing_user:
            return jsonify(error = f"{username} ({email}) already exists!", login = False, status = 400)
        else:
            try:
                new_user = User(
                id = get_uuid(),
                username = username,
                email = email,
                joined_at = dt.now().strftime("%Y-%m-%d %H:%M:%S"),
                admin = False,
                active = True)
                # session["user_id"] = new_user.id
            except BaseException as error:
                print(f"Unexpected {err=}, {type(err)=}")

            print("user " + new_user.username + " was added")  # Create an instance of the User class
            
            new_user.set_password(password)
            
            db.session.add(new_user)  # Adds new User record to database
            db.session.commit()


            return jsonify(msg = "You've been successfully registrated. Please, use your credentials to enter our service",
                           login = True,
                           status = 200)
    
    return jsonify(msg = "Ooops, something went wrong :*(", login = False, status = 401)

@app.route("/api/login", methods = ["POST"])
def login(): 

    email = request.json.get("email", None)
    password = request.json.get("password", None)
    user = User.query.filter_by(email = email).first()

    # print(f"E-mail is: {email}")
    # print(f"Password is: {password}")
    # print(f"User password is: {user.password}")  
    # print(f"Matching: {user.check_password(password = password)}")

    if user is None:
        return jsonify(error = "User not found.", status = 400)
    else:
        if user and user.check_password(password = password):
            if user.is_authenticated():
                print('alredy logged in')
                return jsonify(msg = "You're logged in!",
                            user_id = user.id,
                            status = 200)
            else:
                user.set_authenticated(True)
                db.session.commit()
                session["user_id"] = user.id
                access_token = create_access_token(identity = email)
                print(f'Sending token: {access_token}')
                return jsonify(msg = "You logged in successfully!",
                            access_token = access_token,
                            user_id = user.id, 
                            status = 200)
        else:
            return jsonify(error = "Password is wrong!", status = 400)
        
    return jsonify(error = "Ooops, something went wrong :*(", status = 401)

@app.route("/api/logout", methods = ["POST"])
def logout():
    user_id = request.json.get("user_id", None)
    user = User.query.filter_by(id = user_id).first()
    user.set_authenticated(False)
    db.session.commit()
    session.pop("user_id", None)
    return jsonify(msg = "Logged out successfully", status = 200)

@app.route("/api/protected", methods = ["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    try:
        current_user = get_jwt_identity()
        print(current_user)
    except(e):
        return jsonify(msg=e, status=e.status)

    return jsonify(logged_in_as = current_user, status=200)

@app.route("/api/camera", methods=['GET'])
def cameras():
    cams = Cameras.query.all()
    results = [
        {
            "id" : cam.id,
            "name": cam.name,
            "ip_address": cam.ip_address,
            "location": cam.location,
            "status" : check_status(cam.ip_address)
        } for cam in cams]

    return jsonify(results)

@app.route("/api/showUsers", methods=['GET'])
def showUsers():
    users = User.query.all()
    results = [
        {
            "username": user.username,
            "email": user.email,
            "active": user.active,
            "_authenticated" : user._authenticated,
            "_anonymous" : user._anonymous
        } for user in users]

    return jsonify(results)

@app.route('/api/camera/<int:identifier>', methods=['GET'])
def handle_cam(identifier):
    # return specifi camera from DB - camera by id
    # also call enpoint GET http://{{ip}}/cgi-bin/admin/setparam.cgi 
    # if code 200 camera is UP else camera is down -> is_up = True / Flase
    
    cam = Cameras.query.filter_by(id = identifier).first()
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
    cam = Cameras.query.filter_by(id = identifier).first()
    sizes = [1280, 800, 320, 200, 640, 400]

    if check_status(cam.ip_address) == 'online':
        if vid_x and vid_y in sizes:
            print(cam.ip_address)
            requests.get("http://%s/cgi-bin/camctrl/camctrl.cgi?video=0&x=%d&y=%d&resolution=1280x800&videosize=%dx%d&stretch=1" %(cam.ip_address, res_x, res_y, vid_x, vid_y))
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
    
    cam = Cameras.query.filter_by(id = identifier).first()
    directions = ['left', 'right', 'up', 'down', 'home']
    zooms = ['wide', 'tele']
    auto = ['pan', 'stop', 'patrol']

    if check_status(cam.ip_address) == 'online':
        if direction in directions:
            requests.get("http://%s/cgi-bin/camctrl/camctrl.cgi?move=%s" %(cam.ip_address, direction))
        elif direction in zooms:
            requests.get("http://%s/cgi-bin/camctrl/camctrl.cgi?video=0&zoom=%s" %(cam.ip_address, direction))
        elif direction in auto:
            requests.get("http://%s/cgi-bin/camctrl/camctrl.cgi?auto=%s" %(cam.ip_address, direction))
        else: return {"error" : f"unknown direction {direction}"}
    else: return {"error" : f"camera {identifier} is offline"}

    response = {
        "Request URL" : "http://%s/cgi-bin/camctrl/camctrl.cgi?move=%s" %(cam.ip_address, direction),
        "Request Method" : "GET",
        "Status Code" : 200
    }

    return jsonify(response)

@app.route('/api/allcamshome', methods=['GET'])
def allCamsHome():
    print('Hi!')
    cams = Cameras.query.all()

    for cam in cams:
        if check_status(cam.ip_address) == 'online':
            requests.get("http://%s/cgi-bin/camctrl/camctrl.cgi?move=home" %(cam.ip_address))
        else:
            print(cam.ip_address + " is offline")

    return jsonify(msg = "All cameras at 'home'", status = 200)

@app.route('/api/camera/<int:identifier>/reset', methods=['POST'])
def cam_reset(identifier):
    # call api POST `http://{{ip}}/cgi-bin/admin/getparam.cgi`
    # write to DB camera date to last_reset 
    # write to DB camera userid to who_last_reset (no priority)

    cam = Cameras.query.filter_by(id = identifier).first()
    request_body = {"system_reset" : 1}

    if check_status(cam.ip_address) == 'online':
        requests.post("http://%s/cgi-bin/admin/setparam.cgi" %cam.ip_address, data = request_body)
        cam.last_reset_date = dt.now()
        cam.who_reset_last = request.remote_addr
        app.db.session.commit()
        return {"message" : f"camera {identifier} restarted"}
    else: return {"error" : f"camera {identifier} is offline"}

@app.route('/api/camera/<int:identifier>/stream', methods=['GET'])
def video_feed(identifier):
    cam = Cameras.query.filter_by(id = identifier).first()
    print(cam.ip_address)
    return Response(gen_frames(cam.ip_address), mimetype='multipart/x-mixed-replace; boundary=frame')

def gen_frames(ip):
    vcap = cv2.VideoCapture(f"rtsp://{ip}:554/live.sdp")  
    while True:
        success, frame = vcap.read()  # read the camera frame
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n') 

def check_status(ip):
    if requests.get("http://%s/cgi-bin/admin/setparam.cgi" %ip).status_code == 200:
        return "online"
    else:
        return "offline"

def get_new_id(t_name, model):
    ids = [t_name.id for t_name in model.query.all()]

    if len(ids) == 0:
        return_id = 1
    else:
        return_id = len(ids) + 1

    return return_id

def get_uuid():
    return uuid4().hex

def stringifyMoveset(json_moveset):
    string = str()
    # print(json_moveset)

    for move in json_moveset:
        string += move['content']
        string += ', '

    return string

def jsonifyMoves(str_moveset):
    # Delete comma and space from the end of string
    str_moveset = str_moveset[:-2] + ""
    # Split camera|move pairs by commas
    str_moveset = str_moveset.split(",")
    # make a list of dicts (JSON_ify)
    moves = [{'id': i, 'content': s.strip()} for i, s in enumerate(str_moveset)]

    return moves

def turn_home(cam_id):
    return(turn_cam(cam_id, 'home'))

if __name__ == "__main__":
    app.run(debug=True)