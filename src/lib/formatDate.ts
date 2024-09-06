interface DateObject {
    calendar: { identifier: string };
    era: string;
    year: number;
    month: number;
    day: number;
}

export const formatDate = (dateObj: DateObject): string => {
    const { year, month, day } = dateObj;
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedDay = day.toString().padStart(2, "0");
    return `${year}-${formattedMonth}-${formattedDay}`;
};
