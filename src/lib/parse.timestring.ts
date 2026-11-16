function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  const [timePart, modifier] = timeStr.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
}

export default parseTimeString;
