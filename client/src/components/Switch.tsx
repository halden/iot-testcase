import { ChangeEvent } from 'react';
import './Switch.css';

type SwitchProps = {
  checked: boolean;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function Switch({ checked, handleChange }: SwitchProps): JSX.Element {
  return (
    <label htmlFor="toggleSensor">
      Show disconnected sensors
      <span className="switch-root">
        <span className={`switch-base${checked ? ' checked' : ''}`}>
          <input id="toggleSensor" type="checkbox" checked={checked} onChange={handleChange} />
          <span className="switch-thumb" />
        </span>
        <span className="switch-track" />
      </span>
    </label>
  );
}
