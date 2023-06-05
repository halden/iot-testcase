import { MouseEvent, useCallback, useState } from 'react';
import useWebSocket, { ConnectionStatus } from './hooks/useWebSocket';
import './App.css';
import ConnectionButton from './components/ConnectionButton';
import Sensor, { SensorData, SensorCommandMessage, VALUE_PLACEHOLDER } from './components/Sensor';
import Switch from './components/Switch';

const SERVER_URL = 'ws://127.0.0.1:5000';

function App() {
  const [sensors, setSensors] = useState<Map<string, SensorData>>(new Map());
  const [areDisconnectedVisible, setDisconnectedSensorsVisible] = useState(true);

  function handleMessage(message: SensorData) {
    setSensors((prev) => {
      const value = message.value ? message.value : prev.get(message.id)?.value ?? VALUE_PLACEHOLDER;

      return new Map(prev).set(message.id, { ...message, value });
    });
  }

  const { status, toggleConnection, sendMessage } = useWebSocket<SensorData, SensorCommandMessage>(handleMessage);

  function handlePowerButtonClick() {
    toggleConnection(SERVER_URL);
  }

  const toggleSensorById = useCallback(
    (id: SensorData['id']) => {
      const sensor = sensors.get(id);

      if (sensor) {
        const message: SensorCommandMessage = {
          command: sensor.connected ? 'disconnect' : 'connect',
          id,
        };

        sendMessage(message);
      }
    },
    [sendMessage, sensors]
  );

  function handleSensorClick({ target }: MouseEvent<HTMLOListElement, globalThis.MouseEvent>) {
    const id = (target as HTMLLIElement).getAttribute('data-sensor-id');

    if (id) toggleSensorById(id);
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
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        <ol
          onClick={(e) => handleSensorClick(e)}
          className={`sensor-stack${areDisconnectedVisible ? '' : ' no-disconnected'}`}
        >
          {[...sensors.values()].map((sensorData) => (
            <Sensor key={sensorData.id} data={sensorData} />
          ))}
        </ol>
      ) : (
        <div className="info-message">
          <h2>No server connection</h2>
          <p>Use power button to connect or try later</p>
        </div>
      )}
    </>
  );
}

export default App;
