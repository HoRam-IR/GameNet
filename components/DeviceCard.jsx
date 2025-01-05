import React from "react";
import { formatTime } from "../utils/format";

const DeviceCard = ({ index, time, running, controllers, cost, onStart, onReset, onControllerChange, onNoteClick }) => (
  <div className="machine-card">
    <h2>Device {index + 1}</h2>
    <img src={index < 4 ? "/imgs/ps4.png" : "/imgs/ps5.png"} alt={index < 4 ? "PS4" : "PS5"} />
    <p>
      <span className="time-icon">⏰</span>
      <span className="formatted-time">{formatTime(time)}</span>
    </p>

    <div className="dropdown-container">
      <label htmlFor={`controllers-${index}`} className="dropdown-label">
        Controllers:
      </label>
      <select
        id={`controllers-${index}`}
        className="custom-dropdown"
        value={controllers}
        onChange={(e) => onControllerChange(index, parseInt(e.target.value))}
      >
        {[1, 2, 3, 4].map((value) => (
          <option key={value} value={value} className="dropdown-option">
            🎮 {value} {value === 1 ? "Controller" : "Controllers"}
          </option>
        ))}
      </select>
    </div>

    <p>
      <span className="cost-icon">💰</span>
      <span className="formatted-cost">{cost}</span> Toman
    </p>
    <button onClick={onNoteClick} className="note-button">
      📝 Notes
    </button>

    <div className="button-group">
      <button onClick={onStart} disabled={running} className="start-button">
        Start
      </button>
      <button onClick={onReset} className="reset-button">
        Reset
      </button>
    </div>
  </div>
);

export default DeviceCard;
