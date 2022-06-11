import { Priority } from "../enums/priority.enum";
import { Status } from "../enums/status.enum";

export class Activity {
  public id!: number;
  public title: string = '';
  public createdOn!: Date;
  public status!: keyof typeof Status;
  public maxPriority?: Priority;
  public currentPriority!: Priority;
  public resolvedOn?: Date;
  public assigned?: string;
  public readonly watchers: string[] = [];
  public description!: string;
  public topicId!: number;
  public estimatedTime?: Date;
  public loggedTime?: Date;
}
