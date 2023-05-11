import axios from "axios";
import API_URL from "../constants/API_URL";
import AuthService from "./AuthService";

class ModelService {
    static getId(email, data) {
        let url = API_URL + "/model/data";
        let config = {
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data : { "email": email, "reqData": `{\"data\": ${JSON.stringify(data)}}` }
        };
        return axios(config)
            .then((response) => {
                if (response.data['accessToken']) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                    return true;
                }
                else {
                    return response;
                }
            });
    }

    static getIdFromAdmin(data) {
        let url = API_URL + "/model/admindata";
        let config = {
            method: 'post',
            url: url,
            headers: {
                ...AuthService.authHeader(),
                'Content-Type': 'application/json'
            },
            data : { "data": data }
        };
        return axios(config)
            .then((response) => {
                return response;
            });
    }
}

export default ModelService