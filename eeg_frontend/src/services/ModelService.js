
class ModelService {
    static getId(data) {
        let url = AUTH_URL + "login";
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