import moment from "moment-timezone"; 

export const getCurrentTimeUTC8 = () => {
  return moment().tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm:ss");
};


export const convertToUTC8 = (utcDate) => {
  return moment.utc(utcDate).tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm:ss");
};


export const convertToUTC = (localDate) => {
  return moment
    .tz(localDate, "Asia/Shanghai")
    .utc()
    .format("YYYY-MM-DD HH:mm:ss");
};
