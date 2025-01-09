import TimerInput from "./TimerInput";
import ControllersSelect from "./ControllersSelect";
import NoteSection from "./NoteSection";
import ButtonsGroup from "./ButtonsGroup";
import { formatTime } from "../utils/format";
import GameSelect from "./GameSelect";

export default function DeviceCard({
  index,
  time,
  running,
  controllers,
  manualTimeInput,
  note,
  onStart,
  onReset,
  selectedCustomOption,
  onCustomOptionChange,
  onControllerChange,
  onNoteChange,
  setManualTimeInput,
  calculateCost,
}) {
  const handleTimerInputChange = (newTime) => {
    setManualTimeInput((prev) => {
      const updated = [...prev];
      updated[index] = newTime;
      return updated;
    });
  };

  return (
    <div className="machine-card">
      <div className="device-info">
        <h2 className="device-title">Device {index + 1}</h2>
        <img
          src={index < 4 ? "/imgs/ps4.png" : "/imgs/ps5.png"}
          alt={index < 4 ? "PS4" : "PS5"}
          className="device-image"
        />

        <div className="device-details">
          <p className="time-display">
            <strong>⏰</strong> {formatTime(time)}
          </p>

          <TimerInput index={index} value={manualTimeInput} onChange={handleTimerInputChange} />

          <ControllersSelect index={index} controllers={controllers} onControllerChange={onControllerChange} />

          <p className="cost-display">
            <span className="cost-icon">💰</span>
            {calculateCost(time, index, controllers)} تومن
          </p>
        </div>

        <NoteSection index={index} note={note} onNoteChange={onNoteChange} />
        <ButtonsGroup running={running} onStart={onStart} onReset={onReset} />
      </div>
      <div className="game-section">
        <GameSelect index={index} selectedOption={selectedCustomOption} onOptionChange={onCustomOptionChange} />
      </div>
    </div>
  );
}
