'use strict';

let slotCounter = 0;

function getFutureSlotTime(requestParams, context, ee, next) {
  // Get a time 1 hour from now
  const futureTime = new Date(new Date().getTime() + (60 * 60 * 1000));
  // Add a unique offset in minutes for each virtual user to avoid slot conflicts
  futureTime.setMinutes(futureTime.getMinutes() + (slotCounter * 15));
  slotCounter++;

  // Reset counter to avoid generating impossibly distant dates
  if (slotCounter > 100) slotCounter = 0; 

  context.vars.slotTime = futureTime.toISOString();
  return next();
}

module.exports = {
  getFutureSlotTime
};