import { Injectable } from "@angular/core";
import { Status } from "../enums/status.enum";
import { CreateActivity } from "./create-activity";
import { Activity } from "./activity";
import { ActivityBuilder } from "./activity-builder";

@Injectable({
    providedIn: 'root'
})
export class CreateActivityBuilder implements ActivityBuilder {
    private activity: CreateActivity = new CreateActivity();

    public static init(): CreateActivityBuilder { return new CreateActivityBuilder(); }

    public setTitle(title: string): CreateActivityBuilder {
        this.activity.title = title;
        return this;
    }

    public setFileName(topic: string): CreateActivityBuilder {
        const date = new Date();
        const fileName = `${date.getFullYear()}-${this.getZeroPaddedDigit(date.getMonth(), 2)}-\
${this.getZeroPaddedDigit(date.getDate(), 2)}-${this.getZeroPaddedDigit(date.getHours(), 2)}_\
${this.getZeroPaddedDigit(date.getMinutes(), 2)}_${this.getZeroPaddedDigit(date.getSeconds(), 2)}-${topic}.md`;
        this.activity.fileName = fileName;
        return this;
    }

    private getZeroPaddedDigit(value: number, digits: number): string {
        return ('0' + value).slice(-Math.abs(digits));
    }

    public setAffected(affected: string): CreateActivityBuilder {
        this.activity.affected = affected;
        return this;
    }

    public withOthersAffected(othersAffected: string[]): CreateActivityBuilder {
        othersAffected.forEach(affected => this.activity.othersAffected.push(affected));
        return this;
    }

    public setDescription(description: string): CreateActivityBuilder {
        this.activity.description = description;
        return this;
    }

    public setCurrentSeverity(severity: string): CreateActivityBuilder {
        this.activity.currentSeverity = severity;
        return this;
    }

    public withMaxSeverity(maxSeverity: string): CreateActivityBuilder {
        this.activity.maxSeverity = maxSeverity;
        return this;
    }

    public setStatus(status: keyof typeof Status): CreateActivityBuilder {
        this.activity.status = status;
        return this;
    }

    public withDuration(duration: string): CreateActivityBuilder {
        const splitDuration = duration.split(':');
        const date = new Date();
        date.setHours(date.getHours() + Number(splitDuration[0]), date.getMinutes() + Number(splitDuration[1]));
        this.activity.duration = date;
        return this;
    }

    public setDate(created: Date): CreateActivityBuilder {
        this.activity.date = created;
        return this;
    }

    public build(): CreateActivity {
        const result: CreateActivity = this.activity;
        
        this.reset();

        return result;
    }

    private reset(): void {
        this.activity = new CreateActivity();
    }
}