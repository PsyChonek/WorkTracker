"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkItem } from "./types/workItem";
import { StorageJSON } from "./types/storageJSON";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import Holidays from "date-holidays";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { holidaysHours, remainingWorkHours, workHours } from "./functions/calendarDays";
import { set } from "date-fns";

export default function Home() {
	// Current date
	const [date, setDate] = useState<Date>(new Date());
	const [data, setData] = useState<StorageJSON | null>(null);

	const [currentMonthAndYear, setCurrentMonthAndYear] = useState<string>("M" + date.getMonth() + "Y" + date.getFullYear());

	// Load data from local storage
	const loadData = (): StorageJSON => {
		const storage = localStorage.getItem("storageJSON") || null;

		if (storage !== null) {
			try {
				const storageJSON: StorageJSON = JSON.parse(storage);
				return storageJSON;
			} catch (e) {
				console.error("Error parsing JSON", e);
			}
		}

		return {
			byMonth: {},
			name: "Work Tracker",
			lastSaveDate: new Date(),
		};
	};

	const saveData = (data: StorageJSON) => {
		localStorage.setItem("storageJSON", JSON.stringify(data));
	};

	const updateWorkItem = (index: number, workItem: WorkItem) => {
		// Create a new object with the updated data
		const newData: StorageJSON = {
			...data,
			byMonth: {
				...data?.byMonth,
				[currentMonthAndYear]: data?.byMonth[currentMonthAndYear]?.map((item, i) => (i === index ? workItem : item)) ?? [],
			},
			name: data?.name ?? "",
			lastSaveDate: new Date(),
		};	
	
		setData(newData);
	};

	const addWorkItem = () => {
		// Create a new object with the updated data
		const newData: StorageJSON = {
			...data,
			byMonth: {
				...data?.byMonth,
				[currentMonthAndYear]: [
					...(data?.byMonth[currentMonthAndYear] ?? []),
					{
						projectName: "New Project",
						monthlyHours: 0,
						completedWork: 0,
					},
				],
			},
			name: data?.name ?? "",
			lastSaveDate: new Date(),
		};

		setData(newData);
	};

	const removeWorkItem = (index: number) => {
		// Remove the item from the array
		// Create a new object with the updated data
		const newData: StorageJSON = {
			...data,
			byMonth: {
				...data?.byMonth,
				[currentMonthAndYear]: data?.byMonth[currentMonthAndYear]?.filter((_, i) => i !== index) ?? [],
			},
			name: data?.name ?? "",
			lastSaveDate: new Date(),
		};

		setData(newData);
	};

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		if (data === undefined || data === null) {
			let storageJSON = loadData();
			setData(storageJSON);
			return;
		}

		saveData(data);
	}, [data]);

	const [thisMonthWorkHours, setThisMonthWorkHours] = useState<number>(0);
	const [thisMonthFreeHours, setThisMothFreeHours] = useState<number>(0);
	const [thisMonthAvailableWorkHours, setThisMonthAvailableWorkHours] = useState<number>(0);
	const [thisMonthCompletedWorkHours, setThisMonthCompletedWorkHours] = useState<number>(0);
	const [thisMonthRemainingWorkHours, setThisMonthRemainingWorkHours] = useState<number>(0);

	useEffect(() => {
		let currentMonthProjects = data?.byMonth[currentMonthAndYear] || [];

		setThisMonthCompletedWorkHours(currentMonthProjects.reduce((acc, item) => acc + item.completedWork, 0));
		setThisMonthRemainingWorkHours(thisMonthWorkHours- thisMonthFreeHours - currentMonthProjects.reduce((acc, item) => acc + item.completedWork, 0));
	}, [currentMonthAndYear, data, thisMonthFreeHours, thisMonthWorkHours]);

	useEffect(() => {
		setCurrentMonthAndYear("M" + date.getMonth() + "Y" + date.getFullYear());

		const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
		const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);


		const workHoursMissed = workHours(startDate, date)
		setThisMonthAvailableWorkHours(workHours(startDate,endDate) - holidaysHours(date) - workHoursMissed);
		setThisMonthWorkHours(workHours(startDate,endDate));
		setThisMothFreeHours(holidaysHours(date));
	}, [date]);

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
						{data?.byMonth[currentMonthAndYear]?.map((item, index) => (
							<Card key={index} className="flex-wrap">
								<CardHeader>
									<CardTitle>
										<Input
											onChange={(e) => {
												let currentMonthProjects = data?.byMonth[currentMonthAndYear] || [];
												currentMonthProjects[index].projectName = e.target.value;
												updateWorkItem(index, currentMonthProjects[index]);
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
											let currentMonthProjects = data?.byMonth[currentMonthAndYear] || [];
											currentMonthProjects[index].monthlyHours = value;
											updateWorkItem(index, currentMonthProjects[index]);

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
											let currentMonthProjects = data?.byMonth[currentMonthAndYear] || [];
											currentMonthProjects[index].completedWork = value;
											updateWorkItem(index, currentMonthProjects[index]);

											// Remove leading zeros
											if (e.target.value.startsWith("0")) {
												e.target.value = value.toString();
											}
										}}
									/>
								</CardContent>
								<CardContent className="flex flex-row gap-4">
									<CardDescription>Remaining Work</CardDescription>
									<span>{(item.monthlyHours - item.completedWork) < 0 ? 0 : (item.monthlyHours - item.completedWork)}</span>
									<CardDescription>Percentage Completed</CardDescription>
									<span>{item.monthlyHours > 0 ? ((item.completedWork / item.monthlyHours) * 100).toFixed(2) : 0}%</span>
									<CardDescription>MD Remaining</CardDescription>
									<span>{(item.monthlyHours / 8 - item.completedWork / 8) < 0 ? 0 : (item.monthlyHours / 8 - item.completedWork / 8) }</span>
								</CardContent>
								<CardFooter className="flex flex-row-reverse gap-4">
									<button
										onClick={() => {
											removeWorkItem(index);
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
						<button onClick={addWorkItem} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
							Add New
						</button>
						<Dialog>
							<DialogTrigger className="bg-orange-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Data</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Saved data</DialogTitle>
									<Textarea
										defaultValue={data ? JSON.stringify(data, null, 2) : ""}
										onChange={(e) => {
											try {
												const storageJSON: StorageJSON = JSON.parse(e.target.value);
												setData(storageJSON);
											} catch (e) {
												console.error("Error parsing JSON", e);
											}
										}}
									/>
								</DialogHeader>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</div>
		</main>
	);
}
