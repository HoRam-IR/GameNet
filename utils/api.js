const apiRequest = async (endpoint, method, body = null) => {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, options);
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
};

export const fetchTimers = () => apiRequest("/api/timers", "GET");
<<<<<<< HEAD
export const updateTimer = (index, action, controllerCount, totalSeconds = 0) =>
  apiRequest("/api/timers", "POST", { index, action, controllerCount, totalSeconds });
=======
export const updateTimer = (index, action, controllerCount) =>
  apiRequest("/api/timers", "POST", { index, action, controllerCount });
>>>>>>> c43b9721062d39ee80a90510b9b6b875f8d22522
export const updateControllers = (index, controllerCount) =>
  apiRequest("/api/controller", "POST", { index, controllerCount });
export const updateNote = (index, note) => apiRequest("/api/notes", "POST", { index, note });
