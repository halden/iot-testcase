import useWebSocket from './hooks/useWebSocket';
import './App.css';
import ConnectionButton from './components/ConnectionButton';

const SERVER_URL = 'ws://127.0.0.1:5000';

function App() {
  function handleMessage(message: any) {
    // TODO handle received messages
  }

  const { status, toggleConnection, sendMessage } = useWebSocket<any, any>(handleMessage);

  function handlePowerButtonClick() {
    toggleConnection(SERVER_URL);
  }

  return (
    <>
      <div className="navbar">
        <ConnectionButton status={status} handleClick={() => handlePowerButtonClick()} />
      </div>
      <div className="info-message">
        <h2>No server connection</h2>
        <p>Use power button to connect</p>
      </div>
    </>
  );
}

export default App;
