import './Sensor.css';
import { memo } from 'react';

export const VALUE_PLACEHOLDER = '-.---';

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

export default memo(function Sensor({ data }: Record<'data', SensorData>): JSX.Element {
  const { id, name, unit, connected, value } = data;

  return (
    <li className={`block sensor${connected ? '' : ' disconnected'}`} data-sensor-id={id}>
      <h5 className="heading">{name}</h5>
      <span className="value">{value ?? VALUE_PLACEHOLDER}</span>
      {unit}
    </li>
  );
});
