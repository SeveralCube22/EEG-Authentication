import './App.css';
import EmotiveClient from "./services/EmotiveClient";
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
      <div style={{alignContent: "center", alignItems: "center"}}>
          <button onClick={startEmotiveClient}>Record</button>
      </div>

  );
}

export default App;
