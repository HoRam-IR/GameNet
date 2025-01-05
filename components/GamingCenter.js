import { useState, useEffect } from "react";
import DeviceCard from "./DeviceCard";
import { calculateCost } from "../utils/cost";
import { fetchTimers, updateControllers, updateNote, updateTimer } from "../utils/api";
import Modal from "./Modal";

export default function GamingCenter() {
  const deviceCount = 6;
  const [timers, setTimers] = useState(Array(deviceCount).fill(0));
  const [running, setRunning] = useState(Array(deviceCount).fill(false));
  const [controllers, setControllers] = useState(Array(deviceCount).fill(1));
  const [notes, setNotes] = useState(Array(deviceCount).fill(""));
  const [modalIndex, setModalIndex] = useState(null);
  const [noteInput, setNoteInput] = useState("");

  useEffect(() => {
    const initializeData = async () => {
      const data = await fetchTimers();
      const currentTimers = data.timers.map((t) => (t > 0 ? Math.floor(Date.now() / 1000) - Math.floor(t / 1000) : 0));
      setTimers(currentTimers);
      setControllers(data.controllers);
      setNotes(data.notes || Array(deviceCount).fill(""));
      currentTimers.forEach((time, index) => {
        if (time > 0) startTimer(index, true);
      });
    };
    initializeData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => prev.map((time, index) => (running[index] ? time + 1 : time)));
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const startTimer = async (index, manual = false) => {
    setRunning((prev) => {
      const newRunning = [...prev];
      newRunning[index] = true;
      return newRunning;
    });
    if (!manual) {
      await updateTimer(index, "start", controllers[index]);
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

  const openNoteModal = (index) => {
    setModalIndex(index);
    setNoteInput(notes[index]);
  };

  const closeNoteModal = () => setModalIndex(null);

  const saveNote = async () => {
    const updatedNotes = [...notes];
    updatedNotes[modalIndex] = noteInput;
    setNotes(updatedNotes);
    setModalIndex(null);
    await updateNote(modalIndex, noteInput);
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
          cost={calculateCost(time, index, controllers[index])}
          onStart={() => startTimer(index)}
          onReset={() => resetTimer(index)}
          onControllerChange={handleControllerChange}
          onNoteClick={() => openNoteModal(index)}
        />
      ))}

      {modalIndex !== null && (
        <Modal
          title={`Note for Device ${modalIndex + 1}`}
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          onSave={saveNote}
          onCancel={closeNoteModal}
        />
      )}
    </div>
  );
}
