"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkItem } from "./types/workItem";
import { APISettings, StorageJSON } from "./types/storageJSON";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import Holidays from "date-holidays";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { holidaysHours, remainingWorkHours, workHours } from "./functions/calendarDays";
import { Login, PullProjects, PullWorkItems } from "./services/tr";
import { ProjectAllUserOutput, WorksheetAllOutput } from "./trclient/applicationwebservice";
import { Dropdown } from "react-day-picker";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function Home() {
	// Current date
	const [date, setDate] = useState<Date>(new Date());
	const [data, setData] = useState<StorageJSON | null>(null);

	const [currentMonthAndYear, setCurrentMonthAndYear] = useState<string>("M" + date.getMonth() + "Y" + date.getFullYear());

	const [collapsedStates, setCollapsedStates] = useState<{ [key: string]: boolean }>({});

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
			apiSettings: {
				url: "https://api.example.cz",
				username: "username",
				password: "password",
			},
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
			apiSettings: data?.apiSettings ?? {
				url: "https://api.example.cz",
				username: "username",
				password: "password",
			},
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
						id: Math.max(...(data?.byMonth[currentMonthAndYear] || []).map((item) => item.id), 0) + 1,
					},
				],
			},
			name: data?.name ?? "",
			lastSaveDate: new Date(),
			apiSettings: data?.apiSettings ?? {
				url: "https://api.example.cz",
				username: "username",
				password: "password",
			},
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
			apiSettings: data?.apiSettings ?? {
				url: "https://api.example.cz",
				username: "username",
				password: "password",
			},
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

	const LoginClick = () => {
		var apiSettings = data?.apiSettings;
		if (!apiSettings) {
			return;
		}

		Login(apiSettings);
	};

	const PullWorkItemsClick = () => {
		const apiSettings = data?.apiSettings;
		if (!apiSettings) {
			return;
		}

		// Pull Projects and update data with project structure
		PullProjects(apiSettings).then((projects: ProjectAllUserOutput[]) => {
			const updatedProjects = projects.map((p, index) => ({
				id: index, // Assign a unique id
				projectName: p.DisplayName || "", // Ensure projectName is always a string
				completedWork: 0,
				monthlyHours: 0,
			}));

			setData((prevData) => ({
				...prevData,
				byMonth: {
					...prevData?.byMonth,
					[currentMonthAndYear]: updatedProjects,
				},
				name: prevData?.name ?? "",
				lastSaveDate: new Date(),
				apiSettings: prevData?.apiSettings ?? {
					url: "https://api.example.cz",
					username: "username",
					password: "password",
				},
			}));
		});

		// Pull Work Items and update data with completed work hours
		PullWorkItems(apiSettings).then((workItems: WorksheetAllOutput[]) => {
			// Filter work items by the current month and year
			const filteredWorkItems = workItems.filter((wi) => {
				const date = new Date(wi.DateWork || "");
				return date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
			});

			console.log(filteredWorkItems);

			// Prepare updated projects with completed work hours
			setData((prevData) => {
				const updatedProjects = (prevData?.byMonth[currentMonthAndYear] || []).map((project) => {
					const workItemHours = filteredWorkItems.filter((wi) => wi.Project === project.projectName).reduce((total, wi) => total + (Number(wi.Hours) || 0), 0);

					return {
						...project,
						completedWork: workItemHours,
					};
				});

				return {
					...prevData,
					byMonth: {
						...prevData?.byMonth,
						[currentMonthAndYear]: updatedProjects,
					},
					name: prevData?.name ?? "",
					lastSaveDate: new Date(),
					apiSettings: prevData?.apiSettings ?? {
						url: "https://api.example.cz",
						username: "username",
						password: "password",
					},
				};
			});
		});
	};

	const [thisMonthWorkHours, setThisMonthWorkHours] = useState<number>(0);
	const [thisMonthFreeHours, setThisMothFreeHours] = useState<number>(0);
	const [thisMonthAvailableWorkHours, setThisMonthAvailableWorkHours] = useState<number>(0);
	const [thisMonthCompletedWorkHours, setThisMonthCompletedWorkHours] = useState<number>(0);
	const [thisMonthRemainingWorkHours, setThisMonthRemainingWorkHours] = useState<number>(0);
	const [thisMonthTotalWorkHours, setThisMonthTotalWorkHours] = useState<number>(0);
	const [thisMonthCurrentOverHours, setThisMonthCurrentOverHours] = useState<number>(0);

	useEffect(() => {
		let currentMonthProjects = data?.byMonth[currentMonthAndYear] || [];

		setThisMonthCompletedWorkHours(currentMonthProjects.reduce((acc, item) => acc + item.completedWork, 0));
		setThisMonthRemainingWorkHours(thisMonthWorkHours - currentMonthProjects.reduce((acc, item) => acc + item.completedWork, 0));
		setThisMonthTotalWorkHours(thisMonthWorkHours + thisMonthFreeHours);
		setThisMonthCurrentOverHours(thisMonthAvailableWorkHours - thisMonthRemainingWorkHours);
	}, [currentMonthAndYear, data, thisMonthFreeHours, thisMonthWorkHours, thisMonthCompletedWorkHours, thisMonthTotalWorkHours]);

	useEffect(() => {
		setCurrentMonthAndYear("M" + date.getMonth() + "Y" + date.getFullYear());

		const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
		const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

		const workHoursMissed = workHours(startDate, date);
		setThisMonthAvailableWorkHours(workHours(startDate, endDate) - workHoursMissed);
		setThisMonthWorkHours(workHours(startDate, endDate));
		setThisMothFreeHours(holidaysHours(date));
	}, [date]);

	// Clear work items data
	const ClearData = () => {
		if (confirm("Are you sure you want to clear all data?")) {
			console.log("Clearing data");
			setData({
				...data,
				byMonth: {},
				name: data?.name ?? "", // Ensure name is a string
				lastSaveDate: data?.lastSaveDate ?? new Date(), // Provide a default date if undefined
				apiSettings: data?.apiSettings || ({} as APISettings), // Provide default apiSettings if undefined
			});
		} else {
			console.log("Data clearing canceled");
		}
	};

	// Toggle the collapsed state using `id` as the key
	const toggleCollapse = (id: number) => {
		setCollapsedStates((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	// Update collapsedStates when data changes
	useEffect(() => {
		if (data?.byMonth[currentMonthAndYear]) {
			// Set initial collapsed states based on completedWork and monthlyHours
			const initialStates = data.byMonth[currentMonthAndYear].reduce((acc, item) => {
				acc[item.id] = item.completedWork === 0 && item.monthlyHours === 0;
				return acc;
			}, {} as { [key: string]: boolean });
			setCollapsedStates(initialStates);
		}
	}, [data, currentMonthAndYear, date]);

	return (
		<main className="m-20">
			<h1 className="text-6xl font-bold text-center m-5">Work Tracker</h1>

			<h2 className="text-4xl font-bold text-center m-5">Calendar</h2>
			<div className="flex flex-row items-start justify-center py-2 gap-4 flex-wrap">
				<div className="flex flex-col items-start justify-center gap-4">
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

					{/* Month selector */}
				</div>
				<div className="flex flex-col items-start justify-center gap-4">
					<div className="flex flex-row w-full gap-5 justify-between bg-secondary text-secondary-foreground p-2 rounded-md">
						<Label>Total hours:</Label>
						<Label>
							<b>{thisMonthTotalWorkHours}</b>
						</Label>
					</div>
					<div className="flex flex-row w-full gap-5 justify-between bg-muted text-muted-foreground p-2 rounded-md">
						<Label>Work hours:</Label>
						<Label>
							<b>{thisMonthWorkHours}</b>
						</Label>
					</div>
					<div className="flex flex-row w-full gap-5 justify-between bg-secondary text-secondary-foreground p-2 rounded-md">
						<Label>Free hours:</Label>
						<Label>
							<b>{thisMonthFreeHours}</b>
						</Label>
					</div>
					<div className="flex flex-row w-full gap-5 justify-between bg-muted text-muted-foreground p-2 rounded-md">
						<Label>Available work hours:</Label>
						<Label>
							<b>{thisMonthAvailableWorkHours}</b>
						</Label>
					</div>
					<div className="flex flex-row w-full gap-5 justify-between bg-secondary text-secondary-foreground p-2 rounded-md">
						<Label>Completed work hours:</Label>
						<Label>
							<b>{thisMonthCompletedWorkHours}</b>
						</Label>
					</div>
					<div className="flex flex-row w-full gap-5 justify-between bg-muted text-muted-foreground p-2 rounded-md">
						<Label>Remaining work hours:</Label>
						<Label>
							<b>{thisMonthRemainingWorkHours}</b>
						</Label>
					</div>
					<div className="flex flex-row w-full gap-5 justify-between bg-secondary text-secondary-foreground p-2 rounded-md">
						<Label>Current over hours:</Label>
						<Label>
							<b>{thisMonthCurrentOverHours}</b>
						</Label>
					</div>
				</div>
			</div>
			{/* Buttons */}
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
								className="w-full h-96"
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
				{/* Clear data */}
				<button onClick={ClearData} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
					Clear data
				</button>
			</div>
			<h2 className="text-4xl font-bold text-center m-5">Work Items</h2>
			<div className="flex flex-col items-center justify-center py-2 flex-wrap">
				<div className="flex flex-col items-center justify-center w-full gap-5 flex-wrap">
					<div className="flex flex-col items-center justify-center py-2 flex-wrap">
						<div className="flex flex-col items-center justify-center w-full gap-5 flex-wrap">
							{/* Expanded Items */}
							<div className="flex flex-row items-center justify-center w-full gap-5 flex-wrap">
								{data?.byMonth[currentMonthAndYear]
									?.slice()
									.sort((a, b) => {
										const aIsCollapsed = collapsedStates[a.id];
										const bIsCollapsed = collapsedStates[b.id];
										return aIsCollapsed === bIsCollapsed ? 0 : aIsCollapsed ? 1 : -1;
									})
									.filter((item) => !collapsedStates[item.id]) // Only show expanded items here
									.map((item) => (
										<Card key={item.id} className="flex-wrap" isCollapsed={collapsedStates[item.id]} title={item.projectName} onToggle={() => toggleCollapse(item.id)}>
											<CardHeader>
												<CardTitle>
													<Input
														onChange={(e) => {
															const currentMonthProjects = data?.byMonth[currentMonthAndYear] || [];
															const updatedItem = { ...item, projectName: e.target.value };
															updateWorkItem(item.id, updatedItem);
														}}
														type="text"
														value={item.projectName}
													/>
												</CardTitle>
											</CardHeader>
											{!collapsedStates[item.id] && (
												<>
													<CardContent className="flex flex-row gap-4 flex-wrap">
														<CardDescription>Monthly Hours</CardDescription>
														<Input
															type="number"
															value={item.monthlyHours}
															onChange={(e) => {
																const value = Number(e.target.value);
																const updatedItem = { ...item, monthlyHours: value };
																updateWorkItem(item.id, updatedItem);
															}}
														/>
														<CardDescription>Completed Work</CardDescription>
														<Input
															type="number"
															value={item.completedWork}
															onChange={(e) => {
																const value = Number(e.target.value);
																const updatedItem = { ...item, completedWork: value };
																updateWorkItem(item.id, updatedItem);
															}}
														/>
													</CardContent>
													<CardContent className="flex flex-row gap-4">
														<CardDescription>Remaining Work</CardDescription>
														<span>{Math.max(item.monthlyHours - item.completedWork, 0)}</span>
														<CardDescription>Percentage Completed</CardDescription>
														<span>{item.monthlyHours > 0 ? ((item.completedWork / item.monthlyHours) * 100).toFixed(2) : 0}%</span>
													</CardContent>
												</>
											)}
											<CardFooter className="flex flex-row-reverse gap-4">
												<button onClick={() => removeWorkItem(item.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
													Remove
												</button>
											</CardFooter>
										</Card>
									))}
							</div>

							{/* Collapsed Items */}
							<div className="flex flex-row items-center justify-center w-full gap-5 flex-wrap">
								{data?.byMonth[currentMonthAndYear]
									?.slice()
									.filter((item) => collapsedStates[item.id]) // Only show collapsed items here
									.map((item) => (
										<Card key={item.id} className="flex-wrap" isCollapsed={collapsedStates[item.id]} title={item.projectName} onToggle={() => toggleCollapse(item.id)}>
											<CardHeader>
												<CardTitle>{item.projectName}</CardTitle>
											</CardHeader>
										</Card>
									))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
