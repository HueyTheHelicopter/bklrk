import axios from 'axios';

let lochost = "http://127.0.0.1:5000/";

export default class PostService {

    static async getStream(id) {
        const response = await axios.get(lochost + "api/camera/" + id + "/stream")
        return response
    }

    static async getCams() {
        const response = await axios.get(lochost + 'api/camera')
        return response.data
    }

    static async getProps(id) {
        const response = await axios.get(lochost + 'api/camera/' + id)
        return response.data
    }
      
    static async rotateCamera(id, direction) {
        const response = await axios.get(lochost + "api/camera/" + id + "/move/" + direction)
        return response.data
    }
      
    static async resetCamera(id) {
        const response = await axios.post(lochost + "api/camera/" + id + "/reset")
        return response.data
    }

    static async allCamsHome() {
        const response = await axios.get(lochost + 'api/allcamshome')
        return response.data
    }

    static async presetNameCheck(props) {

        const data = {
            "p_name": props.p_name,
            "p_bearer" : props.p_bearer
        };
        
        const response = await axios.post(lochost + 'api/presetNameCheck', data)
        return response.data
    }

    static async sendNewPreset(moveset, p_name, p_bearer) {

        const data = {
            "p_name" : p_name,
            "p_bearer" : p_bearer,
            "moveset" : moveset
        };

        try {
            const response = await axios.post(lochost + 'api/savePreset', data)
            return response.data
        } catch (e) {
            return (e)
        }
    }

    static async getPresets() {
        try {
            const response = await axios.get(lochost + 'api/getPresets')
            return response.data
        } catch (e) { alert (e) }
    }

    static async movesetString(id) {
        try {
            const response = await axios.get(lochost+ 'api/stringMoveset', {headers: {'id': id}})
            return response.data
        } catch(e) { alert(e) }
    }

    static async executePreset(p_name) {
        try {
            const response = await axios.get(lochost + 'api/executePreset', {headers: {p_name: p_name}})
            console.log(response.data)
            return response.data
        } catch (e) { alert (e) }
    }

    static async delOneMove(p_id, m_id){
        try {
            const data = {
                'p_id' : p_id,
                'm_id' : m_id
            }

            const response = await axios.post(lochost + 'api/delOneMove', data)
            return response.data

        } catch (e) { alert(e) }
    }

    static async deletePreset(p_name, p_bearer) {
        
        const data = {
            "p_name": p_name,
            "p_bearer" : p_bearer
        };

        try {
            const response = await axios.post(lochost + 'api/delPreset', data)
            return response.data
        } catch (e) { alert (e) }
    }

    static async userLogin(props) {

        const data = {
            "email": props.email,
            "password": props.password
        };

        try {
            const resp = await axios.post(lochost + "api/login", data)
            
            if (resp.data.status === 200) {

                sessionStorage.setItem("access_token", resp.data.access_token)
                sessionStorage.setItem("my_id", resp.data.user_id)

                return resp.data
            } else { return resp.data }

            
        } catch (error) {
            sessionStorage.setItem("access_error", error)
        }
    }

    static async userLogout() {

        const data = {
            "user_id" : sessionStorage.getItem("my_id")
        };

        const resp = await axios.post(lochost + "api/logout", data, {withCredentials: true})
        return resp.data
    }

    static async getUserByToken(token) {
        try {
            const response = await axios.get(lochost + "api/protected", {headers : {Authorization: 'Bearer ' + token }})
            return response.data
        } catch (e) { alert(e) }

    }

    static async userRegistrate(props) {

        const data = {
            "username": props.username,
            "email": props.email,
            "password": props.password,
            "repeat_password": props.repeat_password,
        }

        const response = await axios.post(lochost + 'api/registrate', data)

        return response.data
    }
}