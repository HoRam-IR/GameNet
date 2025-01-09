export default function TimerInput({ index, value, onChange }) {
  return (
    <div className="timer-input-container">
      <label htmlFor={`manual-time-${index}`} className="timer-input-label">
        ست کردن زمان (hh:mm:ss):
      </label>
      <input
        id={`manual-time-${index}`}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="00:00:00"
        className="timer-input-field"
      />
    </div>
  );
}
