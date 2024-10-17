import { LoginNewInput, LoginNewResponse, LoginNewResult, ProjectAllUserInput, ProjectAllUserOutput, WorksheetAllInput, WorksheetAllOutput, WorksheetAllResponse } from "../trclient/applicationwebservice";
import { LoginNew, ProjectAllUser, WorksheetAll } from "../trclient/client";
import { APISettings } from "../types/storageJSON";
import Cookies from "js-cookie";

/**
 * Login to the API
 * Store login into httponly cookie
 */
export function Login(apiSettings: APISettings): void {
	let input: LoginNewInput = {
		Username: apiSettings.username,
		Password: atob(apiSettings.password),
	};

	LoginNew(input, apiSettings.url).then((response: LoginNewResult) => {
		if (response.ID) {
			Cookies.set("login", response.ID, { expires: 1, path: "/" });
			console.log("Login successful");
		} else {
			console.error("Login failed");
		}
	});
}

/**
 * Pull all workitems from the API
 */
export async function PullWorkItems(apiSettings: APISettings): Promise<WorksheetAllOutput[]> {
	// From date previous month xs:dateTime
	let fromDate = new Date();
	fromDate.setMonth(fromDate.getMonth() - 1);
	fromDate.setDate(1);

	// To date next month xs:dateTime
	let toDate = new Date();
	toDate.setMonth(toDate.getMonth() + 1);
	toDate.setDate(0);

	// Format dates
	let fromDatem = fromDate.toISOString();
	let toDatem = toDate.toISOString();

	let input: WorksheetAllInput = {
		ID_Login: Cookies.get("login"),
		DateFrom: fromDatem,
		DateTo: toDatem,
	};

	return WorksheetAll(input, apiSettings.url).then((response: WorksheetAllOutput[]) => {
		return response;
	});
}

/**
 * Pull all projects from the API
 */
export async function PullProjects(apiSettings: APISettings): Promise<ProjectAllUserOutput[]> {
	let input: ProjectAllUserInput = {
		ID_Login: Cookies.get("login"),
	};

	return ProjectAllUser(input, apiSettings.url).then((response: ProjectAllUserOutput[]) => {
		return response;
	});
}