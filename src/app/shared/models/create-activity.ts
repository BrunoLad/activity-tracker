import { Status } from '../enums/status.enum';
import { Activity } from "./activity";

export class CreateActivity implements Activity {
    public title!: string;
    public fileName!: string;
    public affected!: string;
    public readonly othersAffected: string[] = [];
    public description!: string;
    public currentSeverity!: string;
    public maxSeverity?: string;
    public status!: keyof typeof Status;
    public date!: Date;
    public duration?: Date;
}