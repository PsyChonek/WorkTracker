"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkItem } from "./types/workItem";
import { StorageJSON } from "./types/storageJSON";
import { use, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import Holidays from "date-holidays";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Login, PullProjects, PullWorkItems } from "./services/tr";
import { json } from "stream/consumers";
import { ProjectAllUserOutput, WorksheetAllOutput } from "./trclient/applicationwebservice";

export default function Home() {
	// Current date
	const [date, setDate] = useState<Date>(new Date());

	let storageJSON = {
		get get(): StorageJSON {
			return JSON.parse(
				localStorage.getItem("storageJSON") ||
					`{
					"byMonth": {},
					"name": "Work Tracker",
					"lastSaveDate": "${new Date().toISOString()}",
					"apiSettings": {
						"url": "",
						"username": "",
						"password": ""
					}
				}`
			);
		},

		set set(value: StorageJSON) {
			localStorage.setItem("storageJSON", JSON.stringify(value));
		},
	};

	const [jsonData, setJsonData] = useState<StorageJSON>(storageJSON.get);

	useEffect(() => {
		storageJSON.set = jsonData;
	}, [jsonData]);

	// Load data from local storage
	const loadData = () => {
		try {
			var dateKey = "M" + date.getMonth() + "Y" + date.getFullYear();
			return storageJSON.get.byMonth[dateKey] || [];
		} catch (error) {
			return [];
		}
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
	const [thisMonthAvailableWorkHours, setThisMonthAvailableWorkHours] = useState<number>(remainingWorkHours());
	const [thisMonthCompletedWorkHours, setThisMonthCompletedWorkHours] = useState<number>(data.reduce((acc, item) => acc + item.completedWork, 0));
	const [thisMonthRemainingWorkHours, setThisMonthRemainingWorkHours] = useState<number>(remainingWorkHours() - data.reduce((acc, item) => acc + item.completedWork, 0));
	const [thisMonthTotalWorkHours, setThisMonthTotalWorkHours] = useState<number>(workHours() + holidaysHours());

	function addNew() {
		setData([...data, { projectName: "New Project", monthlyHours: 0, completedWork: 0 }]);
	}

	useEffect(() => {
		setThisMonthCompletedWorkHours(data.reduce((acc, item) => acc + item.completedWork, 0));
		setThisMonthRemainingWorkHours(workHours() + holidaysHours() - data.reduce((acc, item) => acc + item.completedWork, 0));
		// eslint-disable-next-line react-hooks/exhaustive-deps

		setJsonData({
			...storageJSON.get,
			byMonth: {
				...storageJSON.get.byMonth,
				["M" + date.getMonth() + "Y" + date.getFullYear()]: data,
			},
		});
	}, [data]);

	const LoginClick = () => {
		var settings = storageJSON.get;
		Login(settings.apiSettings);
	};

	const PullWorkItemsClick = () => {
		var settings = storageJSON.get;
		PullWorkItems(settings.apiSettings).then((workItems: WorksheetAllOutput[]) => {
			console.log(workItems);

			// Filter work items by date
			workItems = workItems.filter((wi) => {
				let date = new Date(wi.DateWork || "");
				return date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
			});

			console.log(workItems);

			// Add to each project hours from work items
			var newData = [...data];

			// Reset hours
			newData.forEach((p) => {
				p.completedWork = 0;
			});

			workItems.forEach((wi) => {
				var project = newData.find((p) => p.projectName === wi.Project);
				if (project) {
					project.completedWork += Number(wi.Hours) || 0;
				}
			});

			setData(newData);
		});
	};

	const PullProjectsClick = async () => {
		var settings = storageJSON.get;
		PullProjects(settings.apiSettings).then((projects: ProjectAllUserOutput[]) => {
			console.log(projects);

			// Create data from projects
			var data: WorkItem[] = projects.map((p) => {
				return {
					projectName: p.DisplayName || "", // Ensure projectName is always a string
					completedWork: 0,
					monthlyHours: 0,
				};
			});

			setData(data);
		});
	};

	return (
		<main className="m-20">
			<h1 className="text-6xl font-bold text-center m-5">Work Tracker</h1>

			<h2 className="text-4xl font-bold text-center m-5">Calendar</h2>
			<div className="flex flex-row items-start justify-center py-2 gap-4 flex-wrap">
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
						},
						weekend: (date) => {
							return date.getDay() === 0 || date.getDay() === 6;
						},
					}}
					modifiersStyles={{
						holidays: {
							color: "#33cc33",
							fontWeight: "bold",
						},
						today: {
							background: "darkblue",
							color: "white",
						},
						weekend: {
							color: "red",
						},
					}}
				/>

				<div className="flex flex-col items-start justify-center gap-4">
					<Label>
						Total hours: <b>{thisMonthTotalWorkHours}</b>
					</Label>
					<Label>
						Work hours: <b>{thisMonthWorkHours}</b>
					</Label>
					<Label>
						Free hours: <b>{thisMonthFreeHours}</b>
					</Label>
					<Label>
						Available work hours: <b>{thisMonthAvailableWorkHours}</b>
					</Label>
					<Label>
						Completed work hours: <b>{thisMonthCompletedWorkHours}</b>
					</Label>
					<Label>
						Remaining work hours: <b>{thisMonthRemainingWorkHours}</b>
					</Label>
				</div>
			</div>
			<h2 className="text-4xl font-bold text-center m-5">Work Items</h2>
			<div className="flex flex-col items-center justify-center py-2 flex-wrap">
				<div className="flex flex-col items-center justify-center w-full gap-5 flex-wrap">
					<div className="flex flex-row items-center justify-center w-full gap-5 flex-wrap">
						{data.map((item, index) => (
							<Card key={index} className="flex-wrap">
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
								<CardContent className="flex flex-row gap-4 flex-wrap">
									<CardDescription>Monthly Hours</CardDescription>
									<Input
										type="number"
										value={item.monthlyHours}
										onChange={(e) => {
											let value = Number(e.target.value);

											const newData = [...data];
											newData[index].monthlyHours = value;
											setData(newData);

											// Remove leading zeros
											if (e.target.value.startsWith("0")) {
												e.target.value = value.toString();
											}
										}}
									/>
									<CardDescription>Completed Work</CardDescription>
									<Input
										type="number"
										value={item.completedWork}
										onChange={(e) => {
											let value = Number(e.target.value);
											const newData = [...data];
											newData[index].completedWork = value;
											setData(newData);

											// Remove leading zeros
											if (e.target.value.startsWith("0")) {
												e.target.value = value.toString();
											}
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
						<Dialog>
							<DialogTrigger className="bg-orange-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Data</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Saved data</DialogTitle>
									<Textarea
										value={JSON.stringify(jsonData)}
										onChange={(e) => {
											console.log(e.target.value);
											setJsonData(JSON.parse(e.target.value));
										}}
									/>
								</DialogHeader>
							</DialogContent>
						</Dialog>
						<button onClick={LoginClick} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
							Log in
						</button>
						<button onClick={PullWorkItemsClick} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4">
							Pull work items
						</button>
						<button onClick={PullProjectsClick} className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mt-4">
							Pull projects
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}
