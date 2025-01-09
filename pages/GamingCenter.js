import { useState, useEffect } from "react";
import { fetchTimers, updateControllers, updateNote, updateTimer } from "../utils/api";
import { calculateCost } from "../utils/cost";
import DeviceCard from "../components/DeviceCard";

export default function GamingCenter() {
  const deviceCount = 6;
  const [timers, setTimers] = useState(Array(deviceCount).fill(0));
  const [running, setRunning] = useState(Array(deviceCount).fill(false));
  const [manualTimeInput, setManualTimeInput] = useState(Array(6).fill("00:00:00")); // For manual input
  const [controllers, setControllers] = useState(Array(deviceCount).fill(1));
  const [notes, setNotes] = useState(Array(deviceCount).fill(""));
  const [customOptions, setCustomOptions] = useState(Array(deviceCount).fill(""));

  // Fetch initial timer, controller, and note data from the server
  useEffect(() => {
    const initializeData = async () => {
      const data = await fetchTimers();
      const currentTimers = data.timers.map((t) => (t > 0 ? Math.floor(Date.now() / 1000) - Math.floor(t / 1000) : 0));
      setTimers(currentTimers);
      setControllers(data.controllers);
      setNotes(data.notes || Array(deviceCount).fill(""));
      currentTimers.forEach((time, index) => {
        if (time > 0) startTimer(index);
      });
    };
    initializeData();
  }, []);

  const startTimer = async (index, manual = false) => {
    setRunning((prev) => {
      const newRunning = [...prev];
      newRunning[index] = true;
      return newRunning;
    });

    if (manual) {
      // Parse manual input (hh:mm:ss) and convert to seconds
      const [hours, minutes, seconds] = manualTimeInput[index].split(":").map(Number);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      setTimers((prev) => {
        const newTimers = [...prev];
        newTimers[index] = totalSeconds;
        return newTimers;
      });

      await updateTimer(index, "start", controllers[index], totalSeconds);
    }
  };

  const resetTimer = async (index) => {
    setTimers((prev) => {
      const newTimers = [...prev];
      newTimers[index] = 0;
      return newTimers;
    });
    setRunning((prev) => {
      const newRunning = [...prev];
      newRunning[index] = false;
      return newRunning;
    });
    await updateTimer(index, "reset", 1);
    await updateControllers(index, 1);
  };

  const handleControllerChange = async (index, value) => {
    setControllers((prev) => {
      const newControllers = [...prev];
      newControllers[index] = value;
      return newControllers;
    });
    await updateControllers(index, value);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => prev.map((time, index) => (running[index] ? time + 1 : time)));
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const handleNoteChange = (index, value) => {
    setNotes((prev) => {
      const updatedNotes = [...prev];
      updatedNotes[index] = value;
      return updatedNotes;
    });

    updateNote(index, value).catch((error) => {
      console.error("Failed to update note:", error);
    });
  };

  const handleCustomOptionChange = (index, value) => {
    setCustomOptions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  return (
    <div className="container">
      <h1>Gaming Center Management</h1>
      {timers.map((time, index) => (
        <DeviceCard
          key={index}
          index={index}
          time={time}
          running={running[index]}
          controllers={controllers[index]}
          manualTimeInput={manualTimeInput[index]}
          note={notes[index]}
          onStart={(manual) => startTimer(index, manual)}
          onReset={() => resetTimer(index)}
          selectedCustomOption={customOptions[index]}
          onCustomOptionChange={(value) => handleCustomOptionChange(index, value)}
          onControllerChange={(value) => handleControllerChange(index, value)}
          onNoteChange={(value) => handleNoteChange(index, value)}
          setManualTimeInput={setManualTimeInput}
          calculateCost={calculateCost}
        />
      ))}
    </div>
  );
}
