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
		Password: apiSettings.password,
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
	let input: WorksheetAllInput = {
		ID_Login: Cookies.get("login"),
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