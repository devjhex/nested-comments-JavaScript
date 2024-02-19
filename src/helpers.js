export const formatDate = (inputDate) => {
    const initialTimeRegex = /^\d+\s+\w+\s+ago$/i;
    if (initialTimeRegex.test(inputDate)) return inputDate;

    /* Initial variables for the calculation */
    const currentDate = new Date();
    const timeStamp = inputDate;
    const currentTimeStamp = currentDate.getTime();
    const timeStampDifference = currentTimeStamp - timeStamp;

    /* Standard conversions */
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;

    if(timeStampDifference < minute) return "Just Now";

    if(timeStampDifference < hour) {
        const minutesAgo = Math.floor(timeStampDifference / minute);
        return `${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago`;
    }
    if(timeStampDifference < day) {
        const hoursAgo = Math.floor(timeStampDifference / hour);
        return `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago`;
    }
    if(timeStampDifference < week) {
        const daysAgo = Math.floor(timeStampDifference / day);
        return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
    }
    if(timeStampDifference < month) {
        const weeksAgo = Math.floor(timeStampDifference / week);
        return `${weeksAgo} week${weeksAgo === 1 ? "" : "s"} ago`;
    }
    if(timeStampDifference < year) {
        const monthsAgo = Math.floor(timeStampDifference / month);
        return `${monthsAgo} month${monthsAgo === 1 ? "" : "s"} ago`;
    }
    
    const yearsAgo = Math.floor(timeStampDifference / year);
    return `${yearsAgo} year${yearsAgo === 1 ? "" : "s"} ago`; 
}

export const getUniqueId = () => {
    let id = (new Date()).getTime();
    return id;
}