import { Status } from "../enums/status.enum";

export class UpdateActivity {
    public description!: string;
    public currentStatus!: keyof typeof Status;
    public newStatus!: keyof typeof Status;
    public topic!: String;
    public date!: Date;
    public currentSeverity!: string;
    public fileName!: string;
}