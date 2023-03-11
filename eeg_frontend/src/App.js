import './App.css';
import EmotiveClient from "./services/EmotiveClient";
function App() {
    const startEmotiveClient = async () => {
        let client = new EmotiveClient('jywCIH1KljuJcJlVpqrYP1OhyOnT1hIpZfLKTEu7', 'EW9pQmSvuHIrTju192gJvmWID7kVumwNRFhUsajaSUAJpzTSKdxcGIMqKzjlvYIGBXkTJUiZ8EFylJ9PUZfxS9iVcv4aq3SJkuuPG1cYjdROBwjKCatAci4dVsvnGhOp');
        await client.init();
    }

  return (
     <button onClick={startEmotiveClient}>Record</button>
  );
}

export default App;
