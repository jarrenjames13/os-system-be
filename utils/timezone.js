import moment from "moment-timezone"; 
/**
 * Get the current timestamp in UTC+8.
 * @returns {string} Formatted datetime string in "YYYY-MM-DD HH:mm:ss"
 */
export const getCurrentTimeUTC8 = () => {
  return moment().tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm:ss");
};

/**
 * Convert a given UTC datetime to UTC+8.
 * @param {string} utcDate - The UTC datetime string (e.g., "2025-03-04T03:16:51.267Z").
 * @returns {string} Converted datetime string in "YYYY-MM-DD HH:mm:ss"
 */
export const convertToUTC8 = (utcDate) => {
  return moment.utc(utcDate).tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm:ss");
};

/**
 * Convert a given UTC+8 datetime back to UTC.
 * @param {string} localDate - The UTC+8 datetime string.
 * @returns {string} Converted UTC datetime string.
 */
export const convertToUTC = (localDate) => {
  return moment
    .tz(localDate, "Asia/Shanghai")
    .utc()
    .format("YYYY-MM-DD HH:mm:ss");
};
