export const calculateCost = (timeInSeconds, index, controllerCount) => {
  const hourlyRateToman = index < 4 ? 40000 : 50000;
<<<<<<< HEAD
  let controllerRateToman = index < 4 ? 5000 : 10000;
  const timeInHours = timeInSeconds / 3600;
  if (controllerCount <= 1) {
    controllerRateToman = 0;
  } else {
    controllerCount -= 1;
  }
  const costToman = hourlyRateToman * timeInHours + controllerRateToman * controllerCount;
=======
  const controllerRateToman = index < 4 ? 5000 : 10000;
  const timeInHours = timeInSeconds / 3600;
  const additionalControllerCost = (controllerCount - 1) * controllerRateToman;
  const costToman = timeInHours * hourlyRateToman + Math.max(0, additionalControllerCost);
>>>>>>> c43b9721062d39ee80a90510b9b6b875f8d22522
  return costToman.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
