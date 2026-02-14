function addAmPm(timeString: string) {
  if (!timeString) return "";
  const [hourStr, minute] = timeString.split(":");
  let hour = parseInt(hourStr, 10);
  const meridian = hour >= 12 ? "PM" : "AM";
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minute} ${meridian}`;
}

export default addAmPm;
