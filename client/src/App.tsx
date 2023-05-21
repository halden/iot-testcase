import { useState } from 'react';
import useWebSocket, { ConnectionStatus } from './hooks/useWebSocket';
import './App.css';
import ConnectionButton from './components/ConnectionButton';
import Sensor, { SensorData, SensorCommandMessage } from './components/Sensor';
import Switch from './components/Switch';

const SERVER_URL = 'ws://127.0.0.1:5000';

function App() {
  const [sensors, setSensors] = useState<Map<string, SensorData>>(new Map());
  const [areDisconnectedVisible, setDisconnectedSensorsVisible] = useState(true);

  function handleMessage(message: SensorData) {
    setSensors((prev) => new Map(prev).set(message.id, message));
  }

  const { status, toggleConnection, sendMessage } = useWebSocket<SensorData, SensorCommandMessage>(handleMessage);

  function handlePowerButtonClick() {
    toggleConnection(SERVER_URL);
  }

  function toggleSensorById(id: SensorData['id']) {
    const sensor = sensors.get(id);

    if (sensor) {
      const message: SensorCommandMessage = {
        command: sensor.connected ? 'disconnect' : 'connect',
        id,
      };

      sendMessage(message);
    }
  }

  return (
    <>
      <div className="navbar">
        <ConnectionButton status={status} handleClick={() => handlePowerButtonClick()} />
        <Switch
          checked={areDisconnectedVisible}
          handleChange={(e) => setDisconnectedSensorsVisible(e.target.checked)}
        />
      </div>

      {status === ConnectionStatus.CONNECTED ? (
        <ol className={`sensor-stack${areDisconnectedVisible ? '' : ' no-disconnected'}`}>
          {[...sensors.values()].map((sensorData) => (
            <Sensor key={sensorData.id} data={sensorData} handleClick={(id) => toggleSensorById(id)} />
          ))}
        </ol>
      ) : (
        <div className="info-message">
          <h2>No server connection</h2>
          <p>Use power button to connect</p>
        </div>
      )}
    </>
  );
}

export default App;
