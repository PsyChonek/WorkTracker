import { WorkItem } from "./workItem";

// Workitem array
export interface StorageJSON{
    byMonth: {
        [key: string]: WorkItem[]
    }
    name: string
    lastSaveDate: Date
}
