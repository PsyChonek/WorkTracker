import { WorkItem } from "./workItem";

// Workitem array
export interface StorageJSON{
    byMonth: {
        [key: string]: WorkItem[]
    }
    name: string
    lastSaveDate: Date

    // API settings
    apiSettings: APISettings
}

export interface APISettings{
    url: string
    username: string
    password: string
}