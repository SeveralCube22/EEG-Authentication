import EmotiveClient from "./EmotivClient";
import EmotivClient from "./EmotivClient";

class EmotivManager {
    constructor(emotivClientId, emotivClientSecret, setEEGData) {
        this.emotivClient = new EmotivClient(emotivClientId, emotivClientSecret, this);
        this.setEEGData = setEEGData;
    }

    init() {
        return this.emotivClient.init()
            .then(() => this.emotivClient.connect())
            .then(() => this.emotivClient.createSession());
    }

    subscribe() {
        return this.emotivClient.subscribe();
    }

    unsubscribe() {
        return this.emotivClient.unsubscribe();
    }

    closeSession() {
        return this.emotivClient.closeSession();
    }

    disconnect() {
        return this.emotivClient.disconnect();
    }

    notify(data) {
        let sensorData = data['eeg'].slice(2, 16);
        this.setEEGData(prev => ({
            'time': [...prev['time'], data['time']],
            'eeg': [...prev['eeg'], sensorData]
        }));
    }
}

export default EmotivManager;