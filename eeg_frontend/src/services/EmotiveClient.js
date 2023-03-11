const CORTEX_URL = "wss://localhost:6868";

//Request ID
const REQUIRE_ACCESS_ID = 1;
const AUTHORIZE_ID = 2;
const QUERY_HEADSET_ID = 3;
const CONTROL_DEVICE_ID = 4;

//Warning Codes
const CONTROL_DEVICE_CODES = [100, 101, 102, 104, 113];

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

        this.isConnected = false;

        this.ws = new WebSocket(CORTEX_URL);
        this.ws.addEventListener('message', (event) => {
           this.onMessage(event.data);
        });

    }

    async init() {
        await this.openConnection();
        await this.requestAccess();
        await this.authorize();
    }

    async connect() {
        await this.queryHeadsets();
        console.log(`HEADSET ID ${this.headsetId}`);
        if(!this.isConnected) await this.connectHeadset();

        console.log(`CONNECTED TO ${this.headsetId}`);
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

    queryHeadsets() {
        let req = {
            "id": QUERY_HEADSET_ID,
            "jsonrpc": "2.0",
            "method": "queryHeadsets"
        }

        let [resolve, reject, p] = createDeferredPromise();

        const handler = (res) => {
            this.headsetId = res["result"][0]["id"]; // assuming only 1 headset is being used
            this.isConnected = res["result"][0]["status"] === "connected" ? true : false;
            resolve();
        }

        this.requests[QUERY_HEADSET_ID] = handler;
        this.ws.send(JSON.stringify(req));
        return p;
    }

    connectHeadset() {
        let req = {
            "id": CONTROL_DEVICE_ID,
            "jsonrpc": "2.0",
            "method": "controlDevice",
            "params": {"command": "connect", "headset": this.headsetId }
        }

        let [resolve, reject, p] = createDeferredPromise();

        const handler = (res) => {
            console.log(`CONTROL ${JSON.stringify(res)}`);
            if("warning" in res) {
                if(res["warning"]["code"] === 104) {
                    this.isConnected = true;
                    resolve();
                }
                else reject();
            }
        }

        this.requests[CONTROL_DEVICE_ID] = handler;
        this.ws.send(JSON.stringify(req));
        return p;

    }

    onMessage(data) {
        console.log(data);
        let res = JSON.parse(data);
        if("id" in res) {
            this.requests[res['id']](res);
        }
        else if("warning" in res) {
            this.handleWarnings(res)
        }
    }

    handleWarnings(res) {
        if(CONTROL_DEVICE_CODES.includes(res["warning"]["code"])) {
            this.requests[res[CONTROL_DEVICE_ID]](res);
        }
    }

}

export default EmotiveClient;