import { Activity } from "./activity";

export interface ActivityBuilder {
    setDescription(description: string): ActivityBuilder;
    setCurrentSeverity(severity: string): ActivityBuilder;
    setFileName(fileName: string): ActivityBuilder;
    build(): Activity;
}
