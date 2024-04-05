import Holidays from "date-holidays";

// Calculate work hours without holidays
export function getWorkingDaysWithoutHolidays(startDate: Date, endDate: Date) {
	var result = 0;

	var currentDate = new Date(startDate.valueOf());

	while (currentDate <= endDate) {
		var weekDay = currentDate.getDay();
		if (weekDay != 0 && weekDay != 6) result++;
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return result;
}

// Calculate holidays
export function getHolidaysDaysInWorkingDays(startDate: Date, endDate: Date) {
	var hd: Holidays = new Holidays("CZ");
	let hDays: any = hd.getHolidays(startDate.getFullYear());

	var result = 0;

	var currentDate = new Date(startDate.valueOf());

	while (currentDate <= endDate) {
		var weekDay = currentDate.getDay();

		if (weekDay != 0 && weekDay != 6 && hDays.some((d: any) => d.start.toISOString() === currentDate.toISOString())) {
			result++;
		}

		currentDate.setDate(currentDate.getDate() + 1);
	}

	return result;
}

// Calculate work hours
export const workHours = (date:Date): number => {
	let workHours = 0;

	let startDate = new Date(date.getFullYear(), date.getMonth(), 1);
	let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

	workHours = getWorkingDaysWithoutHolidays(startDate, endDate) * 8;
	workHours -= getHolidaysDaysInWorkingDays(startDate, endDate) * 8;

	return workHours;
};

// Calculate holidays hours
export const holidaysHours = (date:Date): number => {
	let startDate = new Date(date.getFullYear(), date.getMonth(), 1);
	let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

	return getHolidaysDaysInWorkingDays(startDate, endDate) * 8;
};

// Calculate remaining work hours
export const remainingWorkHours = (date:Date): number => {
	let remainingWorkHours = 0;

	let startDate = date;
	let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

	remainingWorkHours = getWorkingDaysWithoutHolidays(startDate, endDate) * 8;
	remainingWorkHours -= getHolidaysDaysInWorkingDays(startDate, endDate) * 8;

	return remainingWorkHours;
};
