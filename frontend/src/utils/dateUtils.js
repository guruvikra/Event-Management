import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const formatDateTime = (date, format = 'YYYY-MM-DD HH:mm') => {
  return dayjs(date).format(format);
};

export const formatDateForInput = (date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const formatTimeForInput = (date) => {
  return dayjs(date).format('HH:mm');
};

export const combineDateAndTime = (date, time) => {
  return dayjs(`${date} ${time}`).toISOString();
};

export const convertToTimezone = (date, timezone) => {
  return dayjs.utc(date).tz(timezone);
};

export const formatDisplayDate = (date) => {
  return dayjs(date).format('MMMM D, YYYY');
};

export const isValidDateTime = (dateTime) => {
  return dayjs(dateTime).isValid();
};

export const isPastDateTime = (dateTime) => {
  return dayjs(dateTime).isBefore(dayjs());
};

export default dayjs;