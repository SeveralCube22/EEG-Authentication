import EmotiveClient from "./EmotivClient";
import EmotivClient from "./EmotivClient";

class EmotivManager {
    constructor(emotivClientId, emotivClientSecret, setEEGData) {
        this.emotivClient = new EmotivClient(emotivClientId, emotivClientSecret, this);
        this.setEEGData = setEEGData;

        // ONLY FOR TESTING GRAPH! WILL DELETE AFTER
        this.intervalId = null;
        this.counter = 0;
    }

    init() {
        return this.emotivClient.init()
            .then(() => this.emotivClient.connect())
            .then(() => this.emotivClient.createSession());
    }

    subscribe() {
        this.intervalId = setInterval(() => {
                this.counter = this.counter + 10;
                this.notify({"time": this.counter, "eeg": Array.from({length: 14}, () => Math.floor(Math.random() * 1000))})
            }
        )
        //return this.emotivClient.subscribe();
    }

    unsubscribe() {
        clearInterval(this.intervalId);
        //return this.emotivClient.unsubscribe();
    }

    closeSession() {
        return this.emotivClient.closeSession();
    }

    disconnect() {
        return this.emotivClient.disconnect();
    }

    notify(data) {
        let sensorData = data['eeg'].slice(2, 16); // only selected sensor data
        //this.setEEGData(eegData => [...eegData, sensorData]);

        // ONLY FOR TESTING
        this.setEEGData(prev => ({
            'time': [...prev['time'], data['time']],
            'eeg': [...prev['eeg'], data['eeg']]
        }));
    }
}

export default EmotivManager;