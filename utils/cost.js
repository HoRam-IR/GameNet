export const calculateCost = (timeInSeconds, index, controllerCount) => {
  const hourlyRateToman = index < 4 ? 40000 : 50000;
  let controllerRateToman = index < 4 ? 8000 : 10000;
  const timeInHours = timeInSeconds / 3600;
  if (controllerCount <= 1) {
    controllerRateToman = 0;
  } else {
    controllerCount -= 1;
  }
  const costToman = hourlyRateToman * timeInHours + controllerRateToman * controllerCount;
  return costToman.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
