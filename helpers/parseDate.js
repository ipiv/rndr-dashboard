
export const parseDate = (dateString) => {
  // Unable to parse date without AM/PM data...
  const [date, time] = dateString.split(' ');
  const dateParts = date.split('-');
  return new Date(
    `${dateParts[2]}/${dateParts[1]}/${dateParts[0]} ${time} AM`
  ).getTime();
};
