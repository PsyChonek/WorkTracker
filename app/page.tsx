"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkItem } from "./types/workItem";
import { StorageJSON } from "./types/storageJSON";
import { use, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import Holidays from "date-holidays";
import { title } from "process";
import { Style } from "util";

export default function Home() {
	// Current date
	const [date, setDate] = useState<Date>(new Date());

	// Load data from local storage
	const loadData = () => {
		const storage = localStorage.getItem("storageJSON") || null;
		if (storage !== null) {
			const storageJSON: StorageJSON = JSON.parse(storage);

			var dateKey = "M" + date.getMonth() + "Y" + date.getFullYear();

			return storageJSON.byMonth[dateKey] || [];
		}
		return [];
	};

	// Calculate work hours without holidays
	function getWorkingDaysWithoutHolidays(startDate: Date, endDate: Date) {
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
	function getHolidaysDaysInWorkingDays(startDate: Date, endDate: Date) {
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
	const workHours = (): number => {
		let workHours = 0;

		let startDate = new Date(date.getFullYear(), date.getMonth(), 1);
		let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

		workHours = getWorkingDaysWithoutHolidays(startDate, endDate) * 8;
		workHours -= getHolidaysDaysInWorkingDays(startDate, endDate) * 8;

		return workHours;
	};

	// Calculate holidays hours
	const holidaysHours = (): number => {
		let startDate = new Date(date.getFullYear(), date.getMonth(), 1);
		let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

		return getHolidaysDaysInWorkingDays(startDate, endDate) * 8;
	};

	// Calculate remaining work hours
	const remainingWorkHours = (): number => {
		let remainingWorkHours = 0;

		let startDate = date;
		let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

		remainingWorkHours = getWorkingDaysWithoutHolidays(startDate, endDate) * 8;
		remainingWorkHours -= getHolidaysDaysInWorkingDays(startDate, endDate) * 8;

		return remainingWorkHours;
	};

	const [data, setData] = useState<WorkItem[]>(loadData());

	const [thisMonthWorkHours, setThisMonthWorkHours] = useState<number>(workHours());
	const [thisMonthFreeHours, setThisMothFreeHours] = useState<number>(holidaysHours());
	const [thisMonthRemainingWorkHours, setThisMonthRemainingWorkHours] = useState<number>(remainingWorkHours());
	const [thisMonthCompletedWorkHours, setThisMonthCompletedWorkHours] = useState<number>(data.reduce((acc, item) => acc + item.completedWork, 0));

	function addNew() {
		setData([...data, { projectName: "New Project", monthlyHours: 0, completedWork: 0 }]);
	}

	useEffect(() => {
		setThisMonthCompletedWorkHours(data.reduce((acc, item) => acc + item.completedWork, 0));

		console.log("Data changed, saving...", data);
		var dateKey = "M" + date.getMonth() + "Y" + date.getFullYear();

		let storageJSON: StorageJSON = {
			byMonth: { [dateKey]: data },
			name: "Work Tracker",
			lastSaveDate: new Date(),
		};

		localStorage.setItem("storageJSON", JSON.stringify(storageJSON));
	}, [data, date]);

	return (
		<main>
			<h1 className="text-6xl font-bold text-center m-5">Work Tracker</h1>

			<h2 className="text-4xl font-bold text-center m-5">Calendar</h2>
			<div className="flex flex-row items-start justify-center py-2 gap-4">
				<Calendar
					mode="default"
					selected={date}
					className="rounded-md border"
					hideHead={false}
					weekStartsOn={1}
					disableNavigation={true}
					modifiers={{
						holidays: (date) => { 
							var hd: Holidays = new Holidays("CZ");
							let hDays: any = hd.getHolidays(date.getFullYear());
							return hDays.some((d: any) => {
								return d.start.toISOString() === date.toISOString();
							});
					}}}
					modifiersStyles={{
						holidays: {
							color: "#33cc33",
							fontWeight: "bold",
						},
						today: {
							background: "#404040",
						}
					}}
				/>

				<div className="flex flex-col items-start justify-center gap-4">
					<Label>
						Work hours: <b>{thisMonthWorkHours}</b>
					</Label>
					<Label>
						Free hours: <b>{thisMonthFreeHours}</b>
					</Label>
					<Label>
						Remaining work hours: <b>{thisMonthRemainingWorkHours}</b>
					</Label>
					<Label>
						Completed work hours: <b>{thisMonthCompletedWorkHours}</b>
					</Label>
				</div>
			</div>
			<h2 className="text-4xl font-bold text-center m-5">Work Items</h2>
			<div className="flex flex-col items-center justify-center py-2">
				<div className="flex flex-col items-center justify-center w-full gap-5">
					<div className="flex flex-row items-center justify-center w-full gap-5 flex-wrap">
						{data.map((item, index) => (
							<Card key={index} className="">
								<CardHeader>
									<CardTitle>
										<Input
											onChange={(e) => {
												const newData = [...data];
												newData[index].projectName = e.target.value;
												setData(newData);
											}}
											type="text"
											value={item.projectName}
										/>
									</CardTitle>
								</CardHeader>
								<CardContent className="flex flex-row gap-4">
									<CardDescription>Monthly Hours</CardDescription>
									<Input
										type="number"
										value={item.monthlyHours}
										onChange={(e) => {
											const newData = [...data];
											newData[index].monthlyHours = Number(e.target.value);
											setData(newData);
										}}
									/>
									<CardDescription>Completed Work</CardDescription>
									<Input
										type="number"
										value={item.completedWork}
										onChange={(e) => {
											const newData = [...data];
											newData[index].completedWork = Number(e.target.value);
											setData(newData);
										}}
									/>
								</CardContent>
								<CardContent className="flex flex-row gap-4">
									<CardDescription>Remaining Work</CardDescription>
									<span>{item.monthlyHours - item.completedWork}</span>
									<CardDescription>Percentage Completed</CardDescription>
									<span>{item.monthlyHours > 0 ? ((item.completedWork / item.monthlyHours) * 100).toFixed(2) : 0}%</span>
									<CardDescription>MD Remaining</CardDescription>
									<span>{item.monthlyHours / 8 - item.completedWork / 8}</span>
								</CardContent>
								<CardFooter className="flex flex-row-reverse gap-4">
									<button
										onClick={() => {
											const newData = [...data];
											newData.splice(index, 1);
											setData(newData);
										}}
										className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
									>
										Remove
									</button>
								</CardFooter>
							</Card>
						))}
					</div>
					<div className="flex flex-row items-center justify-center w-full gap-5">
						<button onClick={addNew} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
							Add New
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}
