import { Injectable } from "@angular/core";
import { Priority } from "../enums/priority.enum";
import { Status } from "../enums/status.enum";
import { Activity } from "./activity";
import { Builder } from "./builder";
import { Topic } from "./topic";

@Injectable({
  providedIn: 'root'
})
export class ActivityBuilder extends Builder<Activity> {
  public activity = new Activity();

  public static init(): Builder<Activity> { return new ActivityBuilder; }

  public setTitle(title: string): ActivityBuilder {
    this.activity.title = title;
    return this;
  }

  public setCreatedOn(date?: Date): ActivityBuilder {
    this.activity.createdOn = date ? date : new Date();
    return this;
  }

  public setStatus(status: keyof typeof Status): ActivityBuilder {
    this.activity.status = status;
    return this;
  }

  public setCurrentPriority(currentPriority: Priority): ActivityBuilder {
    this.activity.currentPriority = currentPriority;
    return this;
  }

  public setDescription(description: string): ActivityBuilder {
    this.activity.description = description;
    return this;
  }

  public setTopicId(topic: number | Topic): ActivityBuilder {
    const value = ((t: number | Topic): t is Topic => (t as Topic).id !== undefined)(topic);
    this.activity.topicId = value ? topic.id : topic;
    return this;
  }

  public withMaxPriority(maxPriority: Priority): ActivityBuilder {
    this.activity.maxPriority = maxPriority;
    return this;
  }

  public withResolvedOn(date?: Date): ActivityBuilder {
    this.activity.resolvedOn = date ? date : new Date();
    return this;
  }

  public withAssigned(user: string): ActivityBuilder {
    this.activity.assigned = user;
    return this;
  }

  public withWatcher(user: string): ActivityBuilder {
    this.activity.watchers.push(user);
    return this;
  }

  public withWatchers(users: string[]): ActivityBuilder {
    users.forEach(u => this.activity.watchers.push(u));
    return this;
  }

  public withEstimatedTime(time: string): ActivityBuilder {
    const refDate = new Date(0);
    const splitDate = time.split(':');
    const parsedTime = +splitDate[0] * 3600000 + +splitDate[1] * 60000;
    refDate.setTime(refDate.getTime() + parsedTime);
    this.activity.estimatedTime = refDate;
    return this;
  }
}
