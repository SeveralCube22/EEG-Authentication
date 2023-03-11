const CORTEX_URL = "wss://localhost:6868";

const REQUIRE_ACCESS_ID = 1;
const AUTHORIZE_ID = 2;
const QUERY_HEADSET_ID = 3;

const createDeferredPromise = () => {
    let deferredResolve;
    let deferredReject;
    let p = new Promise((resolve, reject) => {
        deferredResolve = resolve;
        deferredReject = reject;
    })
    return [deferredResolve, deferredReject, p];
}

class EmotiveClient {
    constructor(clientId, clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.requests = {};

        this.ws = new WebSocket(CORTEX_URL);
        this.ws.addEventListener('message', (event) => {
           this.onMessage(event.data);
        });

    }

    async init() {
        await this.openConnection();
        await this.requestAccess();
        await this.authorize();
        console.log(this.cortexToken);
    }

    openConnection() {
        return new Promise((resolve, reject) => {
            if(this.ws.readyState !== 1) {
                this.ws.onopen = function() {
                    resolve()
                }
            }
            else
                resolve();
        })
    }

    requestAccess() {
        let req = {
            "jsonrpc": "2.0",
            "id": REQUIRE_ACCESS_ID,
            "method": "requestAccess",
            "params": {
                "clientId": this.clientId,
                "clientSecret": this.clientSecret
            },
        };

        let [resolve, reject, p] = createDeferredPromise();

        function handler(res) {
            resolve();
        }

        this.requests[REQUIRE_ACCESS_ID] = handler;
        this.ws.send(JSON.stringify(req));

        return p;
    }

    authorize() {
        let req = {
            "id": AUTHORIZE_ID,
            "jsonrpc": "2.0",
            "method": "authorize",
            "params": { "clientId": this.clientId, "clientSecret": this.clientSecret }
        }

        let [resolve, reject, p] = createDeferredPromise();

        const handler = (res) => {
            this.cortexToken = res["result"]["cortexToken"];
            resolve();
        }

        this.requests[AUTHORIZE_ID] = handler;
        this.ws.send(JSON.stringify(req));
        return p;
    }

    onMessage(data) {
        let res = JSON.parse(data);
        if("id" in res) {
            this.requests[res['id']](res);
        }
    }

}

export default EmotiveClient;