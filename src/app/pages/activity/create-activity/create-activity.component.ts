import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, delay, Observable, Subject, takeUntil } from 'rxjs';
import { ActivityService } from 'src/app/core/services/activity.service';
import { SituationMap } from 'src/app/shared/configs/activity/situationBack.config';
import { Status } from 'src/app/shared/enums/status.enum';
import { CreateActivityBuilder } from 'src/app/shared/models/create-activity-builder';
import * as activityConfig from 'src/app/shared/configs/activity/activity';
import { CreateActivity } from 'src/app/shared/models/create-activity';

@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.scss']
})
export class CreateActivityComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  private disabledSubject$: BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
  // delay(0) is used to prevent NG0100. Cf.
  // https://blog.angular-university.io/angular-debugging/
  public disabled$: Observable<boolean> = this.disabledSubject$.asObservable().pipe(delay(0));
  public statuses: string[];
  public situations: string[];
  public topics: string[];
  private readonly map: Map<string, string> = SituationMap;

  public createActivityForm = new FormGroup({
    topics: new FormControl(''),
    name: new FormControl(''),
    description: new FormControl(''),
    situation: new FormControl(''),
    duration: new FormControl('', Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<CreateActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly activityService: ActivityService,
    private activityBuilder: CreateActivityBuilder
  ) {
    if (data.status !== Status.to_do) {
      this.createActivityForm.get('duration')!.setValidators(null);
    }

    this.createActivityForm.addControl('status', new FormControl(data.status));
    this.createActivityForm.addControl('affected', new FormControl({ value: data.mainAffected, disabled: true }));

    // Initialize form fields using config files
    this.statuses = activityConfig.statuses;
    this.situations = activityConfig.situations;
    this.topics = activityConfig.topics.filter(topic => topic.toUpperCase() !== data.mainAffected.toUpperCase());
  }

  ngOnInit(): void {
    this.createActivityForm.valueChanges.pipe(takeUntil(this.unsubscribe$))
    .subscribe(_ => {
      this.disabledSubject$.next(this.createActivityForm.invalid);
    });
  }

  public createActivity(): void {
    const activity: CreateActivity = this.buildActivity();

    this.activityService.createActivity(activity)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => this.dialogRef.close(response),
        error: (err: any) => {
          console.error(err);
          this.dialogRef.close();
        }
      });
  }

  public statusToggle(select: any): void {
    const durationControl = this.createActivityForm.get('duration');

    if (select.value === Status.to_do) {
      durationControl?.setValidators(Validators.required);
    } else {
      this.createActivityForm.patchValue({ duration: '' });
      durationControl?.setValidators(null);
    }

    durationControl?.updateValueAndValidity();
  }

  private buildActivity(): CreateActivity {
    const mainAffected = this.createActivityForm.get('affected')?.value;
    const status: string = this.createActivityForm.get('status')?.value;
    const toDoStatus: any = Status.to_do;

    let activityBuilder = this.activityBuilder.setFileName(mainAffected)
      .setDescription(this.createActivityForm.get('description')?.value)
      .setTitle(this.createActivityForm.get('name')?.value)
      .setAffected(mainAffected)
      .setCurrentSeverity(this.map.get(this.createActivityForm.get('situation')?.value)!)
      // @ts-ignore
      .setStatus(Status[status]);

    if (status === toDoStatus) {
      activityBuilder = activityBuilder.withDuration(this.createActivityForm.get('duration')?.value);
    }

    if (this.createActivityForm.get('topics')?.value) {
      activityBuilder = activityBuilder.withOthersAffected(this.createActivityForm.get('topics')?.value);
    }

    const data = activityBuilder.build();

    return data;
  }

  ngOnDestroy(): void {
    this.disabledSubject$.unsubscribe();
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
