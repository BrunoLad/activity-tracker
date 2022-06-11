import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Status } from 'src/app/shared/enums/status.enum';
import { ActivityBuilder } from 'src/app/shared/models/activity-builder';
import { Priority } from 'src/app/shared/enums/priority.enum';
import { Activity } from 'src/app/shared/models/activity';
import { FormControl, FormGroup } from '@angular/forms';
import { UpdateActivityForm } from 'src/app/shared/models/update-activity-form';

@Component({
  selector: 'app-update-activity',
  templateUrl: './update-activity.component.html',
  styleUrls: ['./update-activity.component.scss']
})
export class UpdateActivityComponent {
  public priorities: string[];
  public activity: Partial<Activity>;
  public readonly statuses = ['To Do', 'In Progress', 'Resolved'];
  public status: Status;

  public updateForm = new FormGroup<UpdateActivityForm>({
    description: new FormControl('', { nonNullable: true }),
    priority: new FormControl(Priority.LOWEST, { nonNullable: true }),
    status: new FormControl('', { nonNullable: true })
  });

  constructor(
    public dialogRef: MatDialogRef<UpdateActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activityBuilder: ActivityBuilder
  ) {
    this.updateForm.setControl('status', new FormControl({ value: data.currentStatus, disabled: true }));

    this.priorities = Object.values(Priority).filter(value => typeof value === 'string') as string[];
    this.activity = data.activity;
    this.status = data.status;
  }

  public get StatusEnum() {
    return Status;
  }

  public updateActivity(): void {
    const result = this.buildActivity();

    this.dialogRef.close(result);
  }

  private buildActivity(): any {
    const status: string = this.updateForm.value.status!;
    const priority = Priority[this.updateForm.value.priority!] as any;

    const activityBuidler = this.activityBuilder.setDescription(this.updateForm.value.description!)
      .setCurrentPriority(priority)
      .setTopicId(this.activity.topicId!)
      // @ts-ignore
      .setStatus(Status[status]);

      return activityBuidler.build();
  }
}
