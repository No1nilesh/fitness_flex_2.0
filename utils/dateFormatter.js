export function formatDateForInput(dateTimeString) {
  const dateObject = new Date(dateTimeString);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const day = String(dateObject.getDate()).padStart(2, "0");
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");
  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
  return formattedDateTime;
}

export function parseDateTimeString(dateTimeString) {
  const [datePart, timePart] = dateTimeString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}
