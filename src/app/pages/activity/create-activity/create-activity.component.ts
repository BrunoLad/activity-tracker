import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, delay, Observable, Subject, takeUntil } from 'rxjs';
import { ActivityService } from 'src/app/core/services/activity.service';
import { Status } from 'src/app/shared/enums/status.enum';
import * as activityConfig from 'src/app/shared/configs/activity/activity';
import { Priority } from 'src/app/shared/enums/priority.enum';
import { ActivityBuilder } from 'src/app/shared/models/activity-builder';
import { Activity } from 'src/app/shared/models/activity';
import { CreateActivityForm } from 'src/app/shared/models/create-activity-form';

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
  public priorities: string[];
  public topics: string[];
  public topic;

  public createActivityForm = new FormGroup<CreateActivityForm>({
    topics: new FormControl([], { nonNullable: true }),
    name: new FormControl('', { nonNullable: true }),
    category: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    priority: new FormControl(Priority.LOWEST, { nonNullable: true }),
    duration: new FormControl('', { nonNullable: true, validators: Validators.required })
  });

  constructor(
    public dialogRef: MatDialogRef<CreateActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly activityService: ActivityService,
    private activityBuilder: ActivityBuilder
  ) {
    if (data.status !== Status.to_do) {
      this.createActivityForm.get('duration')!.setValidators(null);
    }

    this.createActivityForm.addControl('status', new UntypedFormControl(data.status));
    this.createActivityForm.setControl('category', new FormControl({ value: data.category.name, disabled: true }));

    // Initialize form fields using config files
    this.statuses = activityConfig.statuses;
    this.priorities = Object.values(Priority).filter(value => typeof value === 'string') as string[];
    this.topics = activityConfig.topics.filter(topic => topic.toUpperCase() !== data.category.name.toUpperCase());
    this.topic = data.category;
  }

  ngOnInit(): void {
    this.createActivityForm.valueChanges.pipe(takeUntil(this.unsubscribe$))
    .subscribe(_ => {
      this.disabledSubject$.next(this.createActivityForm.invalid);
    });
  }

  public createActivity(): void {
    const activity: Activity = this.buildActivity();

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

  private buildActivity(): Activity {
    const topicId = this.topic.id;
    const status: string = this.createActivityForm.value.status!;
    const toDoStatus: any = Status.to_do;
    const priority = Priority[this.createActivityForm.value.priority!] as any;

    let activityBuilder = this.activityBuilder.setDescription(this.createActivityForm.value.description!)
      .setTitle(this.createActivityForm.value.name!)
      .setTopicId(topicId)
      .setCurrentPriority(priority)
      // @ts-ignore
      .setStatus(Status[status]);

    if (status === toDoStatus) {
      activityBuilder = activityBuilder.withEstimatedTime(this.createActivityForm.value.duration!);
    }

    if (this.createActivityForm.get('topics')?.value) {
      // activityBuilder = activityBuilder.withOthersAffected(this.createActivityForm.get('topics')?.value);
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
