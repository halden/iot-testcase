import './Sensor.css';

const VALUE_PLACEHOLDER = '-.---';

export type SensorCommandMessage = {
  command: 'connect' | 'disconnect';
  id: string;
};

export type SensorData = {
  id: string;
  name: string;
  connected: boolean;
  unit: string;
  value: string | null;
};

type SensorProps = {
  data: SensorData;
  handleClick: (id: SensorData['id']) => void;
};

export default function Sensor({ data, handleClick }: SensorProps): JSX.Element {
  const { id, name, unit, connected, value } = data;
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <li className={`block sensor${connected ? '' : ' disconnected'}`} onClick={() => handleClick(id)}>
      <h5 className="heading">{name}</h5>
      <span className="value">{value ?? VALUE_PLACEHOLDER}</span>
      {unit}
    </li>
  );
}
