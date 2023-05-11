import './App.css';
import LoginPage from "./Login";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import {useState} from "react";
import AdminLoginPage from "./Admin";
import Home from "./Home";
import AdminUpload from "./AdminUpload";
import Confidence from "./Confidence";

function App() {
    let [eegData, setEEGData] = useState({'time': [], 'eeg': []});

    return (
         //<button onClick={startEmotiveClient}>Record</button>
        <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LoginPage setEEGData={setEEGData} eegData={eegData}/>} />
                        <Route path="/admin" element={<AdminLoginPage/>} />
                        <Route path="/home" element={<Home/>} />
                        <Route path="/adminpage" element={<AdminUpload/>} />
                        <Route path="/confidence" element={<Confidence/>} />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
