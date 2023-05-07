import axios from "axios";
import API_URL from "../constants/API_URL";

class ModelService {
    static getId(data) {
        let url = API_URL + "/model/data";
        let config = {
            method: 'post',
            url: url,
            headers: {
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