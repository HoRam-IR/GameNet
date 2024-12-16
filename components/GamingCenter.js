// components/GamingCenter.js (or wherever it's located)
import { useState, useEffect } from 'react';

export default function GamingCenter() {
  const [timers, setTimers] = useState([0, 0, 0, 0, 0, 0]);
  const [running, setRunning] = useState([false, false, false, false, false, false]);
  const [controllers, setControllers] = useState([1, 1, 1, 1, 1, 1]);

  // Fetch initial timer data from the custom server
  useEffect(() => {
    const fetchTimers = async () => {
      const response = await fetch('/api/timers');
      const data = await response.json();
      for (let index = 0; index < data.timers.length; index++) {
        let element = data.timers[index];
        if (element > 0) {
          data.timers[index] = Math.floor(Date.now() / 1000) - Math.floor(data.timers[index] / 1000);
        }
      }
      setTimers(data.timers);
      setControllers(data.controllers); // Set initial controller state
      for (let index = 0; index < data.timers.length; index++) {
        let element = data.timers[index];
        if (element > 0) {
          startTimer(index, true);
        }
      }
    };
    fetchTimers();
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
    handleControllerChange(index, 1)
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
    const hourlyRateToman = index < 4 ? 45000 : 65000;
    const controllerRateToman = 5000;
    const timeInHours = timeInSeconds / 3600;
    const costToman = (hourlyRateToman * timeInHours) + (controllerRateToman * controllerCount);
    return costToman.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleControllerChange = (index, value) => {
    setControllers((prev) => {
      const newControllers = [...prev];
      newControllers[index] = value;
      return newControllers;
    });
  };

  return (
    <div className="container">
      <h1>Gaming Center Management</h1>
      {timers.map((time, index) => (
        <div key={index} className="machine-card">
          <h2>Machine {index + 1}</h2>
          <p>Time: {formatTime(time)}</p>

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

          <p>Cost: {calculateCost(time, index, controllers[index])} Toman</p>

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
    </div>
  );
}
