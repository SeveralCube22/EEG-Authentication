const CORTEX_URL = "wss://localhost:6868";

//Request ID
const REQUIRE_ACCESS_ID = 1;
const AUTHORIZE_ID = 2;
const QUERY_HEADSET_ID = 3;
const CONTROL_DEVICE_ID = 4;

const CREATE_SESSION_ID = 5;
const CREATE_RECORD_ID = 6;
const SUBSCRIBE_ID = 7;
const INJECT_MARKER_ID = 8;


const UNSUBSCRIBE_ID = 9;
const CLOSE_SESSION_ID = 10;
const DISCONNECT_ID = 11;

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

class EmotivClient {
    constructor(clientId, clientSecret, manager) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.manager = manager;

        this.requests = {};

        this.isConnected = false;

        //this.ws = new WebSocket(CORTEX_URL);
        /*this.ws.addEventListener('message', (event) => {
           this.onMessage(event.data);
        });*/

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

    async disconnect() {
        this.isConnected = false;
        await this.disconnectHeadset();
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

    createSession() {
       let req = {
            "id": CREATE_SESSION_ID,
            "jsonrpc": "2.0",
            "method": "createSession",
            "params": { "cortexToken": this.cortexToken, "status": "active", "headset": this.headsetId }
        }

        let [resolve, reject, p] = createDeferredPromise();

        const handler = (res) => {
            this.sessionId = res["result"]["id"];
            resolve();
        }

        this.requests[CREATE_SESSION_ID] = handler;
        this.ws.send(JSON.stringify(req));
        return p;
    }

    createRecord() {
        let req = {
            "id": CREATE_RECORD_ID,
            "jsonrpc": "2.0",
            "method": "createRecord",
            "params": {"cortexToken": this.cortexToken, "session": this.sessionId, "title": "Record"}
        }

        let [resolve, reject, p] = createDeferredPromise();

        const handler = (res) => {
            this.recordId = res["result"]["record"]["uuid"];
            resolve();
        }

        this.requests[CREATE_RECORD_ID] = handler;
        this.ws.send(JSON.stringify(req));
        return p;
    }

    subscribe() {
        let req = {
            "id": SUBSCRIBE_ID,
            "jsonrpc": "2.0",
            "method": "subscribe",
            "params": {
                "cortexToken": this.cortexToken,
                "session": this.sessionId,
                "streams": ["eeg"]
            }
        }

        let [resolve, reject, p] = createDeferredPromise();

        const handler = (res) => {
            this.dataCols = res["result"]["success"][0]["cols"];
            resolve();
        }

        this.requests[SUBSCRIBE_ID] = handler;
        this.ws.send(JSON.stringify(req));
        return p;

    }

    unsubscribe() {
        let req = {
            "id": UNSUBSCRIBE_ID,
            "jsonrpc": "2.0",
            "method": "unsubscribe",
            "params": {
                "cortexToken": this.cortexToken,
                "session": this.sessionId,
                "streams": ["eeg"]
            }
        }

        let [resolve, reject, p] = createDeferredPromise();

        const handler = (res) => {
            resolve();
        }

        this.requests[UNSUBSCRIBE_ID] = handler;
        this.ws.send(JSON.stringify(req));
        return p;
    }

    closeSession() {
        let req = {
            "id": CLOSE_SESSION_ID,
            "jsonrpc": "2.0",
            "method": "updateSession",
            "params": {
                "cortexToken": this.cortexToken,
                "session": this.sessionId,
                "status": "close"
            }
        }

        let [resolve, reject, p] = createDeferredPromise();

        const handler = (res) => {
            resolve();
        }

        this.requests[CLOSE_SESSION_ID] = handler;
        this.ws.send(JSON.stringify(req));
        return p;

    }

    disconnectHeadset() {
        let req = {
            "id": DISCONNECT_ID,
            "jsonrpc": "2.0",
            "method": "controlDevice",
            "params": {
                "command": "disconnect",
                "headset": this.headsetId
            }
        }

        let [resolve, reject, p] = createDeferredPromise();

        const handler = (res) => {
            resolve();
        }

        this.requests[DISCONNECT_ID] = handler;
        this.ws.send(JSON.stringify(req));
        return p;
    }

    onMessage(data) {
        console.log(data);
        let res = JSON.parse(data);
        if("id" in res) {
            this.requests[res['id']](res);
        }
        else if("sid" in res) {
            this.handleDataSample(res);
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

    handleDataSample(res) {
        let time = res["time"];
        let data = res["eeg"]
        let final = {"time": time, "data": data}
        this.manager.notify(final);
    }
}

export default EmotivClient;