"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkItem } from "./types/workItem";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Home() {
	const [data, setData] = useState<WorkItem[]>([]);

	function addNew() {
		setData([...data, { projectName: "New Project", monthlyHours: 0, completedWork: 0 }]);
	}

	function sync() {}

	return (
		<main>
			<h1 className="text-6xl font-bold text-center m-5">Work Tracker</h1>
			<p className="text-center m-5">A simple work tracker app</p>
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
								<CardFooter className="flex flex-row gap-4">
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
									<button
										onClick={() => {
											const newData = [...data];
											newData[index] = { projectName: "New Project", monthlyHours: 0, completedWork: 0 };
											setData(newData);
										}}
										className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
									>
										Reset
									</button>
								</CardFooter>
							</Card>
						))}
					</div>
					<div className="flex flex-row items-center justify-center w-full gap-5">
						<button onClick={addNew} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
							Add New
						</button>
						<button onClick={sync} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
							Sync
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}
