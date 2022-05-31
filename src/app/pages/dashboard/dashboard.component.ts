import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, defer, EMPTY, iif, interval, map, Observable, of, share, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { FilterService } from 'src/app/core/services/filter.service';
import { GitProjectService } from 'src/app/core/services/git-project.service';
import { ActivityService } from 'src/app/core/services/activity.service';
import { Status } from 'src/app/shared/enums/status.enum';
import { Category } from 'src/app/shared/models/category';
import { Activity } from 'src/app/shared/models/activity';
import { SelectedActivity } from 'src/app/shared/models/selected-activity';
import { Topic } from 'src/app/shared/models/topic';
import { environment } from 'src/environments/environment';
import { CreateActivityComponent } from '../activity/create-activity/create-activity.component';
import { UpdateActivityComponent } from '../activity/update-activity/update-activity.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnDestroy {
  public theme = 'light_mode';
  public showContent = false;
  public topicsSelected = false;
  private unsubscribe$ = new Subject();
  public affected!: string;
  public categories: Observable<Category[]> = this.filterService.getCategories();
  // public categories = of([{ name: 'abc' }, { name: 'def' }]);
  public topics!: Observable<Topic[]>;
  public dragging = false;
  private lastRunningReqs: boolean[] = [];
  private runningSubscription: any;
  private snackBarRef: any;
  public pipelineUrl!: string;
  public completedActivitiesUrl!: string;

  private isResolvedReady = new BehaviorSubject(false);
  public isResolvedReady$: Observable<boolean> = this.isResolvedReady.asObservable();
  private isScheduledReady = new BehaviorSubject(false);
  public isScheduledReady$: Observable<boolean> = this.isScheduledReady.asObservable();
  private isOngoingReady = new BehaviorSubject(false);
  public isOngoingReady$: Observable<boolean> = this.isOngoingReady.asObservable();

  public scheduled: Observable<SelectedActivity[]> = EMPTY;
  public ongoing: Observable<SelectedActivity[]> = EMPTY;
  public resolved: Observable<SelectedActivity[]> = EMPTY;

  @ViewChild('snackBar')
  snackBar!: TemplateRef<any>;

  constructor(
    private readonly activityService: ActivityService,
    private readonly filterService: FilterService,
    private readonly dialog: MatDialog,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly _snackBar: MatSnackBar,
    private readonly gitProjectService: GitProjectService
  ) {
    this.pipelineUrl = environment.pipelineUrl;
    this.completedActivitiesUrl = environment.activityTracker;
  }

  public get StatusEnum() {
    return Status;
  }

  public handleDragStart(event: any): void {
    this.dragging = true;
  }

  public drop(event: CdkDragDrop<SelectedActivity[]>, currentStatus: Status): void {
    const updateActivityConfig = {
      width: '50vw',
      data: {
        // pastStatus is already part of activity object
        activity: event.previousContainer.data[event.previousIndex],
        currentStatus,
        mainAffected: this.affected
      }
    };

    const dialogRef = this.dialog.open(UpdateActivityComponent, updateActivityConfig);

    dialogRef.afterClosed().pipe(
      switchMap(x => iif(() => !!x, defer(() => this.activityService.updateActivity(x)), EMPTY)),
      takeUntil(this.unsubscribe$)
    ).subscribe({
      next: (response) => {
        if (response && event.previousContainer !== event.container) {
          transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
        }
      },
      error: (err) => console.error(err)
    });
  }

  public openActivityRegistrationDialog(status: Status): void {
    const activityConfig = { width: '50vw', data: { status, mainAffected: this.affected } };
    const activityDialogRef = this.dialog.open(CreateActivityComponent, activityConfig);

    activityDialogRef.afterClosed().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(response => {
      if (response) {
        this.updateAffected();
      }
    });
  }

  public updateWithoutStatus(activity: Activity, currentStatus: Status): void {
    if (this.dragging) {
      this.dragging = false;
      return;
    }

    const updateActivityConfig = {
      width: '50vw',
      data: {
        // pastStatus is already part of activity object
        activity: activity,
        currentStatus,
        mainAffected: this.affected
      }
    };

    const dialogRef = this.dialog.open(UpdateActivityComponent, updateActivityConfig);
    dialogRef.afterClosed().pipe(
      switchMap(x => iif(() => !!x, defer(() => this.activityService.updateActivity(x)), EMPTY)),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  public openActivityDetails($event: any, activity: any, status: Status): void {
    const url = `${this.completedActivitiesUrl}/activities/\
${this.affected}/${Status[status]}/${activity.fileName.replace('.md', '').replace(/[:]/g, '_')}/`.toLowerCase();

    window.open(url,
      '_blank'
    );

    $event.stopPropagation();
  }

  public updateAffected($event?: any): void {
    this.isResolvedReady.next(false);
    this.isOngoingReady.next(false);
    this.isScheduledReady.next(false);

    this.topicsSelected = true;
    this.showContent = true;
    this.affected = $event ? $event.value : this.affected;
    this.scheduled = this.activityService.getActivities(this.affected, Status[Status.scheduled])
      .pipe(share(), tap(() => this.isScheduledReady.next(true)));
    this.ongoing = this.activityService.getActivities(this.affected, Status[Status.in_progress])
      .pipe(share(), tap(() => this.isOngoingReady.next(true)));
    this.resolved = this.activityService.getActivities(this.affected, Status[Status.resolved])
      .pipe(share(), tap(() => this.isResolvedReady.next(true)));
  }

  public getTopics(event: any): void {
    this.topicsSelected = false;
    this.topics = this.filterService.getTopicsByCategory(event.value).pipe(map(g => g.topics));
  }

  public getUsername(): string {
    const userInfo: any = this.authService.getUserInfo();
    return userInfo.user.usr;
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  public switchTheme(event: any): void {
    document.body.classList.toggle('my-light-theme');
    this.theme = this.theme === 'dark_mode' ? 'light_mode' : 'dark_mode';
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next({});
    this.unsubscribe$.complete();
  }
}
