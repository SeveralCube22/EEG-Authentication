import axios from "axios";
import API_URL from "../constants/API_URL";

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
}

export default ModelService