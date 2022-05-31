import { Status } from "../enums/status.enum";

export interface SelectedActivity {
    title: string;
    date: Date;
    status: keyof typeof Status;
    duration: Date;
    maxSeverity: string;
    currentSeverity: string;
    resolvedOn: Date;
    affected: string[];
    othersAffected: string[];
    fileName: string;
    description: string;
}
