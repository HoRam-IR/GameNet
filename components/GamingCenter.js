import { useState, useEffect } from 'react';

export default function GamingCenter() {
  const [timers, setTimers] = useState([0, 0, 0, 0, 0, 0]);
  const [running, setRunning] = useState([false, false, false, false, false, false]);
  const [controllers, setControllers] = useState([1, 1, 1, 1, 1, 1]);
  const [notes, setNotes] = useState(['', '', '', '', '', '']); // Notes for each device
  const [modalIndex, setModalIndex] = useState(null); // Index of the device for the modal
  const [noteInput, setNoteInput] = useState(''); // Current note input

  // Fetch initial timer, controller, and note data from the server
  useEffect(() => {
    const fetchInitialData = async () => {
      const response = await fetch('/api/timers');
      const data = await response.json();
      for (let index = 0; index < data.timers.length; index++) {
        let element = data.timers[index];
        if (element > 0) {
          data.timers[index] = Math.floor(Date.now() / 1000) - Math.floor(data.timers[index] / 1000);
        }
      }
      setTimers(data.timers);
      setControllers(data.controllers);
      setNotes(data.notes || ['', '', '', '', '', '']); // Fetch notes or set default
      for (let index = 0; index < data.timers.length; index++) {
        let element = data.timers[index];
        if (element > 0) {
          startTimer(index, true);
        }
      }
    };
    fetchInitialData();
  }, []);

  const startTimer = async (index, manual) => {
    setRunning((prev) => {
      const newRunning = [...prev];
      newRunning[index] = true;
      return newRunning;
    });

    if (!manual) {
      await fetch('/api/timers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index, action: 'start', controllerCount: controllers[index] }),
      });
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
    handleControllerChange(index, 1);
    await fetch('/api/timers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ index, action: 'reset', controllerCount: 1 }),
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        return prev.map((time, index) => (running[index] ? time + 1 : time));
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const calculateCost = (timeInSeconds, index, controllerCount) => {
    const hourlyRateToman = index < 4 ? 40000 : 50000;
    let controllerRateToman = index < 4 ? 5000 : 10000;
    const timeInHours = timeInSeconds / 3600;
    if (controllerCount <= 1) {
      controllerRateToman = 0;
    } else {
      controllerCount -= 1;
    }
    const costToman = (hourlyRateToman * timeInHours) + (controllerRateToman * controllerCount);
    return costToman.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleControllerChange = async (index, value) => {
    setControllers((prev) => {
      const newControllers = [...prev];
      newControllers[index] = value;
      return newControllers;
    });
    await fetch('/api/controller', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ index, controllerCount: value }),
    });
  };

  const openNoteModal = (index) => {
    setModalIndex(index);
    setNoteInput(notes[index]); // Set current note content
  };

  const closeNoteModal = () => {
    setModalIndex(null);
  };

  const saveNote = async () => {
    const updatedNotes = [...notes];
    updatedNotes[modalIndex] = noteInput;
    setNotes(updatedNotes); // Update the local notes state
    setModalIndex(null); // Close the modal
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index: modalIndex, note: noteInput }),
    });
  };

  return (
    <div className="container">
      <h1>Gaming Center Management</h1>
      {timers.map((time, index) => (
        <div key={index} className="machine-card">
          <h2>Device {index + 1}</h2>
          <img src={index < 4 ? "/imgs/ps4.png" : "/imgs/ps5.png"} alt={index < 4 ? "PS4" : "PS5"} />
          <p><span className="time-icon">⏰</span>{formatTime(time)}</p>

          <div>
            <label htmlFor={`controllers-${index}`}>Controllers: </label>
            <select
              id={`controllers-${index}`}
              value={controllers[index]}
              onChange={(e) => handleControllerChange(index, parseInt(e.target.value))}
            >
              {[1, 2, 3, 4].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>

          <p><span className="cost-icon">💰</span>{calculateCost(time, index, controllers[index])} Toman</p>

          <button onClick={() => openNoteModal(index)} className="note-button">📝 Notes</button>

          <div className="button-group">
            <button onClick={() => startTimer(index)} disabled={running[index]} className="start-button">
              Start
            </button>
            <button onClick={() => resetTimer(index)} className="reset-button">
              Reset
            </button>
          </div>
        </div>
      ))}

      {modalIndex !== null && (
        <div className="modal">
          <div className="modal-content">
            <h2>Note for Device {modalIndex + 1}</h2>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Write your note here..."
            />
            <div className="modal-actions">
              <button onClick={saveNote} className="save-button">Save</button>
              <button onClick={closeNoteModal} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
