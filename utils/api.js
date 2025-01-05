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
export const updateTimer = (index, action, controllerCount) =>
  apiRequest("/api/timers", "POST", { index, action, controllerCount });
export const updateControllers = (index, controllerCount) =>
  apiRequest("/api/controller", "POST", { index, controllerCount });
export const updateNote = (index, note) => apiRequest("/api/notes", "POST", { index, note });
