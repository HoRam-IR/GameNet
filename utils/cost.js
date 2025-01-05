export const calculateCost = (timeInSeconds, index, controllerCount) => {
  const hourlyRateToman = index < 4 ? 40000 : 50000;
  const controllerRateToman = index < 4 ? 5000 : 10000;
  const timeInHours = timeInSeconds / 3600;
  const additionalControllerCost = (controllerCount - 1) * controllerRateToman;
  const costToman = timeInHours * hourlyRateToman + Math.max(0, additionalControllerCost);
  return costToman.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
