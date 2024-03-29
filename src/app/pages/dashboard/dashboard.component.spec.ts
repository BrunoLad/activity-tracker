import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { FilterService } from 'src/app/core/services/filter.service';
import { GitProjectService } from 'src/app/core/services/git-project.service';
import { ActivityService } from 'src/app/core/services/activity.service';
import { Status } from 'src/app/shared/enums/status.enum';
import { Topic } from 'src/app/shared/models/topic';
import { environment } from 'src/environments/environment';
import { CreateActivityComponent } from '../activity/create-activity/create-activity.component';
import { UpdateActivityComponent } from '../activity/update-activity/update-activity.component';

import { DashboardComponent } from './dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { Category } from 'src/app/shared/models/category';
import { Activity } from 'src/app/shared/models/activity';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const matDialogRefStub = () => ({
    close: (value: any) => (value),
    afterClosed: () => of({})
  });

  const matDialogStub = () => ({
    open: (x: any, y: any) => TestBed.inject(MatDialogRef)
  });

  const activityServiceStub = () => ({
    createActivity: (activity: any) => of({}),
    updateActivity: (activity: any) => of({}),
    getActivities: (topic: any, status: any) => of({})
  });

  const filterServiceStub = () => ({
    getCategories: () => of(),
    getTopicsByCategory: (x: any) => of({})
  });

  const authServiceStub = () => ({
    logout: () => false,
    getUserInfo: () => ({ user: { usr: 'bruno' } })
  });

  const gitProjectServiceStub = () => ({
    isPipelineRunning: () => of()
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      imports: [
        MatToolbarModule,
        MatSelectModule,
        DragDropModule,
        MatButtonModule,
        MatTooltipModule,
        BrowserAnimationsModule,
        MatDialogModule,
        RouterTestingModule,
        MatMenuModule,
        MatSnackBarModule,
        MatIconModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: MatDialogRef, useFactory: matDialogRefStub },
        { provide: ActivityService, useFactory: activityServiceStub },
        { provide: FilterService, useFactory: filterServiceStub },
        { provide: MatDialog, useFactory: matDialogStub },
        { provide: AuthService, useFactory: authServiceStub },
        { provide: GitProjectService,  useFactory: gitProjectServiceStub },
        MatSnackBar,
        MatProgressSpinner
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('StatusEnum', () => {
    it('should return Status', () => {
      const result = component.StatusEnum;

      expect(typeof result).toBe(typeof Status);
    });
  });

  describe('handleDragStart', () => {
    it('verify method for normal call', () => {
      component.handleDragStart({});

      expect(component.dragging).toBeTruthy();
    });

    it('should call method on element drag', waitForAsync(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();

        component.showContent = true;
        component.toDo = of([{title: 'abc'} as any, { title: 'blabla' } as any]);
        component.ongoing = of([{} as any, {} as any]);
        component.resolved = of([{} as any, {} as any]);
        spyOn(component, 'handleDragStart').and.callThrough();
        spyOn(component, 'updateWithoutStatus').and.callFake(() => false);
        spyOn(component, 'openActivityRegistrationDialog').and.callFake(() => ({}));

        fixture.detectChanges();

        const element = fixture.debugElement.query(By.css('.example-box'));
        element.triggerEventHandler('cdkDragStarted', {});

        fixture.detectChanges();

        expect(component.handleDragStart).toHaveBeenCalled();
        expect(component.dragging).toBeTruthy();
        expect(element.nativeElement.classList).toContain('drag');
      });
    }));
  });

  describe('drop', () => {
    it('should verify method for normal call', fakeAsync(() => {
      const dialog = TestBed.inject(MatDialog);
      const dialogRef = TestBed.inject(MatDialogRef);
      spyOn(dialog, 'open').and.returnValue(dialogRef);
      spyOn(dialogRef, 'afterClosed').and.returnValue(of({}));

      const dragDrop: any = {
        previousIndex: 0,
        currentIndex: 0,
        item: {},
        container: { data: ['a', 'b', 'c'] },
        previousContainer: { data: [1, 2, 3] },
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 }
      };

      component.topic = {
        id: 1,
        categoryId: 1,
        name: 'topic'
      };
      const config = {
        width: '50vw',
        data: {
          activity: dragDrop.previousContainer.data[dragDrop.previousIndex],
          currentStatus: Status.in_progress,
          category: component.topic
        }
      };

      component.drop(dragDrop, Status.in_progress);
      tick(1);

      discardPeriodicTasks();

      expect(dialog.open).toHaveBeenCalledOnceWith(UpdateActivityComponent, config);
      expect(dialogRef.afterClosed).toHaveBeenCalled();
    }));
  });

  describe('openActivityRegistrationDialog', () => {
    it('should verify method for normal call', fakeAsync(() => {
      const dialog = TestBed.inject(MatDialog);
      const dialogRef = TestBed.inject(MatDialogRef);
      const activityService = TestBed.inject(ActivityService);
      spyOn(activityService, 'getActivities').and.returnValue(of({} as any));
      spyOn(dialog, 'open').and.returnValue(dialogRef);
      spyOn(dialogRef, 'afterClosed').and.returnValue(of({}));

      component.topic = {
        id: 1,
        categoryId: 1,
        name: 'topic'
      };
      const config = {
        width: '50vw',
        data: {
          status: Status.in_progress,
          category: component.topic
        }
      };
      component.openActivityRegistrationDialog(Status.in_progress);

      tick(1);
      discardPeriodicTasks();

      expect(dialog.open).toHaveBeenCalledOnceWith(CreateActivityComponent, config);
      expect(dialogRef.afterClosed).toHaveBeenCalled();
    }));

    it('should call method on button click', waitForAsync(() => {
      fixture.whenStable().then(() => {
        spyOn(component, 'openActivityRegistrationDialog').and.callThrough();
        const dialog = TestBed.inject(MatDialog);
        const dialogRef = TestBed.inject(MatDialogRef);
        spyOn(dialog, 'open').and.callFake(matDialogStub().open);
        spyOn(dialogRef, 'afterClosed').and.callFake(matDialogRefStub().afterClosed);

        component.showContent = true;
        component.topic = {
          id: 1,
          categoryId: 1,
          name: 'topic'
        };
        component.toDo = of([{} as any, {} as any]);
        component.ongoing = of([{} as any, {} as any]);
        component.resolved = of([{} as any, {} as any]);

        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('.addition-button'));
        button.nativeElement.click();

        const config = {
          width: '50vw',
          data: {
            status: Status.to_do,
            category: component.topic
          }
        };

        expect(component.openActivityRegistrationDialog).toHaveBeenCalledOnceWith(Status.to_do);
        expect(dialog.open).toHaveBeenCalledOnceWith(CreateActivityComponent, config);
        expect(dialogRef.afterClosed).toHaveBeenCalled();
      });
    }));
  });

  describe('updateWithoutStatus', () => {
    it('should verify method for normal call', fakeAsync(() => {
      const dialog = TestBed.inject(MatDialog);
      const dialogRef = TestBed.inject(MatDialogRef);
      spyOn(dialog, 'open').and.returnValue(dialogRef);
      spyOn(dialogRef, 'afterClosed').and.returnValue(of({}));

      component.topic = {
        id: 1,
        categoryId: 1,
        name: 'topic'
      };
      const activity = {} as Activity;

      const config = {
        width: '50vw',
        data: {
          activity: activity,
          currentStatus: Status.in_progress,
          category: component.topic
        }
      };

      component.updateWithoutStatus(activity, Status.in_progress);

      tick(1);
      discardPeriodicTasks();

      expect(dialog.open).toHaveBeenCalledWith(UpdateActivityComponent, config);
      expect(dialogRef.afterClosed).toHaveBeenCalled();
    }));

    it('should call method on element click', waitForAsync(() => {
      fixture.whenStable().then(() => {
        spyOn(component, 'updateWithoutStatus').and.callThrough();
        const dialog = TestBed.inject(MatDialog);
        const dialogRef = TestBed.inject(MatDialogRef);
        spyOn(dialog, 'open').and.callFake(matDialogStub().open);
        spyOn(dialogRef, 'afterClosed').and.callFake(matDialogRefStub().afterClosed);

        component.showContent = true;
        component.topic = {
          id: 1,
          categoryId: 1,
          name: 'topic'
        };
        component.toDo = of([{} as any, {} as any]);
        component.ongoing = of([{} as any, {} as any]);
        component.resolved = of([{} as any, {} as any]);

        fixture.detectChanges();

        const element = fixture.debugElement.query(By.css('.example-box'));
        element.nativeElement.click();

        expect(component.updateWithoutStatus).toHaveBeenCalled();
        expect(dialog.open).toHaveBeenCalled();
        expect(dialogRef.afterClosed).toHaveBeenCalled();
      });
    }));
  });

  describe('openActivityDetails', () => {
    beforeEach(() => {
      spyOn(window, 'open');
      component.showContent = true;
      component.topic = {
        id: 1,
        categoryId: 1,
        name: 'topic'
      };
    });

    it('should open past activities page url', () => {
      const activity: any = {
        fileName: 'abc'
      };

      component.openActivityDetails({ stopPropagation: () => ({}) } as any, activity, Status.in_progress);
      expect(window.open).toHaveBeenCalledOnceWith(
        `${environment.activityTracker}/activities/topic/in_progress/abc/`,
        '_blank'
      );
    });

    it('should generate correct link based on fileName pattern', () => {
      const activity: any = {
        fileName: '2021-01-01-08_20:00-work.md'
      };

      component.openActivityDetails({ stopPropagation: () => ({}) } as any, activity, Status.in_progress);
      expect(window.open).toHaveBeenCalledOnceWith(
        `${environment.activityTracker}/activities/topic/in_progress/2021-01-01-08_20_00-work/`,
        '_blank'
      );
    });

    it('should generate appropriate url on element', waitForAsync(() => {
      fixture.whenStable().then(() => {

        component.toDo = of([{ fileName: 'aaa' } as any, {} as any]);
        component.ongoing = of([{} as any, {} as any]);
        component.resolved = of([{} as any, {} as any]);

        fixture.detectChanges();

        const link = fixture.debugElement.query(By.css('.example-box a'));
        link.nativeElement.click();

        fixture.detectChanges();

        expect(window.open).toHaveBeenCalledOnceWith(
          `${environment.activityTracker}/activities/topic/to_do/aaa/`,
          '_blank'
        );
      });
    }));
  });

  describe('updateCategory', () => {
    it('should update category', () => {
      const event: any = { value: 'work' };

      component.updateCategory(event);

      expect(component.topicsSelected).toBeTruthy();
      expect(component.showContent).toBeTruthy();
      expect(component.topic).toBe(event.value);
    });
  });

  describe('getTopics', () => {
    it('should update topics list', done => {
      const filterService = TestBed.inject(FilterService);
      const topics = [
        { name: 'task1', id: 1, categoryId: 1 },
        { name: 'task2', id: 2, categoryId: 1 }
    ];
      const topics$: any = of(topics);
      const selectEvent: any = {
        value: {
          name: 'aaa',
          id: 1,
          _links: {}
        } as Category
      };

      spyOn(filterService, 'getTopicsByCategory').and.returnValue(topics$);
      component.getTopics(selectEvent);

      expect(component.topicsSelected).toBeFalsy();
      expect(filterService.getTopicsByCategory).toHaveBeenCalledOnceWith(selectEvent.value);
      component.topics$.subscribe((value: Topic[]) => {
        expect(value).toEqual(topics);
        done();
      });
    });
  });

  describe('logout', () => {
    it('should verify method for normall invocation', () => {
      const service = TestBed.inject(AuthService);
      const router = TestBed.inject(Router);
      spyOn(service, 'logout');
      spyOn(router, 'navigateByUrl');

      component.logout();

      expect(service.logout).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledOnceWith('/login');
    });
  });

  describe('switchTheme', () => {
    it('should switch theme', () => {
      component.switchTheme({});

      expect(document.body.classList).toContain('my-light-theme');
      expect(component.theme).toBe('dark_mode');
    });

    it('should switch theme on click', waitForAsync(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const icon = fixture.debugElement.query(By.css('.right-aligned span .mat-icon'));
        icon.nativeElement.click();

        fixture.detectChanges();
        fixture.detectChanges();

        expect(document.body.classList).toContain('my-light-theme');
        expect(fixture.componentInstance.theme).toBe('dark_mode');
      });
    }));

    afterEach(() => {
      document.body.classList.remove('my-light-theme');
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      spyOn(Subject.prototype, 'next');
      spyOn(Subject.prototype, 'complete');

      component.ngOnDestroy();

      expect(Subject.prototype.next).toHaveBeenCalled();
      expect(Subject.prototype.complete).toHaveBeenCalledTimes(1);
    });
  });
});
