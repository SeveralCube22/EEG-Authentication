import axios from "axios";
import API_URL from "../constants/API_URL";

class AuthService {
    static login(email, password) {
        let url = API_URL + "/auth/login";
        let config = {
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data : { "email": email, "password": password }
        };

        return axios(config)
            .then((response) => {
                if (response.data['accessToken']) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                    return true
                }
                else {
                    console.log("INVALID CREDS");
                    return false
                }
            });
    }

    static isAdmin() {
        let url = API_URL + "/auth/isdamin";
        let config = {
            method: 'post',
            url: url,
            headers: {
                ...AuthService.authHeader(),
                'Content-Type': 'application/json'
            },
        };

        return axios(config)
            .then((response) => {
                return response;
            });
    }

    static authHeader() {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user && user['accessToken']) {
            return { 'Authorization': 'Bearer ' + user['accessToken'] };
        }
        else
            return {};
    }
}

export default AuthService;