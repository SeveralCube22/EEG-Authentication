import './App.css';
import EmotiveClient from "./services/EmotiveClient";
import LoginPage from "./Login";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
function App() {
    const startEmotiveClient = async () => {
        let client = new EmotiveClient('jywCIH1KljuJcJlVpqrYP1OhyOnT1hIpZfLKTEu7', 'EW9pQmSvuHIrTju192gJvmWID7kVumwNRFhUsajaSUAJpzTSKdxcGIMqKzjlvYIGBXkTJUiZ8EFylJ9PUZfxS9iVcv4aq3SJkuuPG1cYjdROBwjKCatAci4dVsvnGhOp');
        await client.init();
        await client.connect();
        await client.createSession();
        await client.subscribe();

        setTimeout( () => {
            console.log("STOPPED");
            client.unsubscribe()
                .then(() => {
                console.log(`NUM DATA SAMPLES: ${client.dataSamples.length}`);
                return client.closeSession();
            })
                .then(() => client.disconnect());

        }, 61000);

    }

  return (
     //<button onClick={startEmotiveClient}>Record</button>
      <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
              <BrowserRouter>
                  <Routes>
                      <Route path="/" element={<LoginPage/>} />
                  </Routes>
              </BrowserRouter>
          </div>
      </div>
  );
}

export default App;
