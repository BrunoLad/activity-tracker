import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SituationMap } from 'src/app/shared/configs/activity/situationBack.config';
import { Status } from 'src/app/shared/enums/status.enum';
import { SelectedActivity } from 'src/app/shared/models/selected-activity';
import { UpdateActivityBuilder } from 'src/app/shared/models/update-activity-builder';
import * as activityConfig from 'src/app/shared/configs/activity/activity';

@Component({
  selector: 'app-update-activity',
  templateUrl: './update-activity.component.html',
  styleUrls: ['./update-activity.component.scss']
})
export class UpdateActivityComponent {
  public situations: string[];
  private readonly map: Map<string, string> = SituationMap;
  public activity: Partial<SelectedActivity>;
  public readonly statuses = ['Scheduled', 'In Progress', 'Resolved'];
  public status: Status;

  public updateForm = new FormGroup({
    description: new FormControl(''),
    situation: new FormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<UpdateActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activityBuilder: UpdateActivityBuilder
  ) {
    this.updateForm.addControl('status', new FormControl({ value: data.currentStatus, disadbled: true }));

    this.situations = activityConfig.situations;
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
    const status: string = this.updateForm.get('status')?.value;

    const activityBuidler = this.activityBuilder.setFileName(this.activity.fileName!)
      .setDescription(this.updateForm.get('description')?.value)
      .setCurrentSeverity(this.map.get(this.updateForm.get('situation')?.value)!)
      .setTopic(this.activity.affected![0])
      .setCurrentStatus(this.activity.status!)
      // @ts-ignore
      .setNewStatus(Status[status]);

      return activityBuidler.build();
  }
}
