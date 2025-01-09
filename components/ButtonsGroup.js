export default function ButtonsGroup({ running, onStart, onReset }) {
  return (
    <div className="button-group">
      <button onClick={() => onStart(true)} disabled={running} className="start-button">
        Start
      </button>
      <button onClick={onReset} className="reset-button">
        Reset
      </button>
    </div>
  );
}
