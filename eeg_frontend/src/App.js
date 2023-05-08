import './App.css';
import LoginPage from "./Login";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import EmotivManager from "./services/EmotivManager";
import {useEffect, useState} from "react";

const CLIENT_ID = 'jywCIH1KljuJcJlVpqrYP1OhyOnT1hIpZfLKTEu7';
const CLIENT_SECRET = 'EW9pQmSvuHIrTju192gJvmWID7kVumwNRFhUsajaSUAJpzTSKdxcGIMqKzjlvYIGBXkTJUiZ8EFylJ9PUZfxS9iVcv4aq3SJkuuPG1cYjdROBwjKCatAci4dVsvnGhOp';

function App() {
    let [eegData, setEEGData] = useState({'time': [], 'eeg': []});
    let emotivManager = new EmotivManager(CLIENT_ID, CLIENT_SECRET, setEEGData);

    return (
         //<button onClick={startEmotiveClient}>Record</button>
        <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LoginPage setEEGData={setEEGData} eegData={eegData}/>} />
                        <Route path="/adminpage" element={<AdminLoginPage/>} />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
