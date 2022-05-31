import { Injectable } from "@angular/core";
import { Status } from "../enums/status.enum";
import { ActivityBuilder } from "./activity-builder";
import { UpdateActivity } from "./update-activity";

@Injectable({
    providedIn: 'root'
})
export class UpdateActivityBuilder implements ActivityBuilder {
    private activity: UpdateActivity = new UpdateActivity();

    public static init(): UpdateActivityBuilder { return new UpdateActivityBuilder() };

    public setDescription(description: string): UpdateActivityBuilder {
        this.activity.description = description;
        return this;
    }

    public setFileName(fileName: string): UpdateActivityBuilder {
        this.activity.fileName = fileName;
        return this;
    }

    public setCurrentSeverity(currentSeverity: string): UpdateActivityBuilder {
        this.activity.currentSeverity = currentSeverity;
        return this;
    }

    public setCurrentStatus(status: keyof typeof Status): UpdateActivityBuilder {
        this.activity.currentStatus = status;
        return this;
    }

    public setNewStatus(status: keyof typeof Status): UpdateActivityBuilder {
        this.activity.newStatus = status;
        return this;
    }

    public setTopic(topic: string): UpdateActivityBuilder {
        this.activity.topic = topic;
        return this;
    }

    public build(): UpdateActivity {
        const result: UpdateActivity = this.activity;

        this.reset();

        return result;
    }

    private reset(): void {
        this.activity = new UpdateActivity();
    }
}
