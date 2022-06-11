import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { ActivityService } from 'src/app/core/services/activity.service';
import { Status } from 'src/app/shared/enums/status.enum';
import { Activity } from 'src/app/shared/models/activity';
import { ActivityBuilder } from 'src/app/shared/models/activity-builder';

import { CreateActivityComponent } from './create-activity.component';

describe('CreateActivityComponent', () => {
  let component: CreateActivityComponent;
  let fixture: ComponentFixture<CreateActivityComponent>;

  const matDialogRefStub = () => ({ close: () => ({}) });
  const activityServiceStub = () => ({
    createActivity: (activity: Activity) => of(new Activity())
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateActivityComponent ],
      imports: [
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { category: { id: 1, name: 'aaa', categoryId: 1 } } },
        { provide: MatDialogRef, useFactory: matDialogRefStub },
        { provide: ActivityService, useFactory: activityServiceStub },
        { provide: ActivityBuilder, useValue: ActivityBuilder.init() }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should verify method normal call', () => {
      const spy = spyOn(component.createActivityForm.valueChanges, 'subscribe');
      component.ngOnInit();

      expect(spy).toHaveBeenCalled();
    });

    it('should update subject with value', fakeAsync(() => {
      const spy = spyOn(BehaviorSubject.prototype, 'next');

      component.ngOnInit();
      component.createActivityForm.updateValueAndValidity();

      tick(1);

      expect(spy).toHaveBeenCalledWith(true);
    }));
  });

  describe('createActivity', () => {
    it('should verify method for normal call', () => {
      const service = TestBed.inject(ActivityService);
      const builder = TestBed.inject(ActivityBuilder);

      spyOn(service, 'createActivity').and.returnValue(of(new Activity()));
      // spyOn(builder, 'withOthersAffected').and.returnValue(builder);
      component.createActivity();

      expect(service.createActivity).toHaveBeenCalled();
    });

    it('should close dialog', fakeAsync(() => {
      const service = TestBed.inject(ActivityService);
      const builder = TestBed.inject(ActivityBuilder);

      spyOn(service, 'createActivity').and.returnValue(of(new Activity()));
      // spyOn(builder, 'withOthersAffected').and.returnValue(builder);
      spyOn(component.dialogRef, 'close');

      component.createActivity();

      tick(1);

      expect(component.dialogRef.close).toHaveBeenCalledWith(new Activity());
    }));
  });

  describe('statusToggle', () => {
    it('todo value selected', () => {
      spyOn(component.createActivityForm, 'get').withArgs('duration')
        .and.returnValue(new FormControl(''));
      spyOn(component.createActivityForm.get('duration')!, 'setValidators');
      spyOn(component.createActivityForm.get('duration')!, 'updateValueAndValidity');

      component.statusToggle({ value: Status.to_do });

      expect(component.createActivityForm.get).toHaveBeenCalled();
      expect(component.createActivityForm.get('duration')?.setValidators)
        .toHaveBeenCalledWith(Validators.required);

      expect(component.createActivityForm.get('duration')?.updateValueAndValidity)
        .toHaveBeenCalled();
    });

    it('other value selected', () => {
      spyOn(component.createActivityForm, 'get').withArgs('duration')
        .and.returnValue(new FormControl(''));
      spyOn(component.createActivityForm.get('duration')!, 'setValidators');
      spyOn(component.createActivityForm, 'patchValue');
      spyOn(component.createActivityForm.get('duration')!, 'updateValueAndValidity');

      component.statusToggle({});

      expect(component.createActivityForm.get).toHaveBeenCalled();
      expect(component.createActivityForm.get('duration')?.setValidators)
        .toHaveBeenCalledOnceWith(null);
      expect(component.createActivityForm.patchValue).toHaveBeenCalledWith({ duration: '' });
      expect(component.createActivityForm.get('duration')?.updateValueAndValidity)
        .toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      const spy = spyOn(BehaviorSubject.prototype, 'unsubscribe');
      spyOn(Subject.prototype, 'next');
      spyOn(Subject.prototype, 'complete');

      component.ngOnDestroy();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(Subject.prototype.next).toHaveBeenCalledOnceWith(true);
      expect(Subject.prototype.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('template scenarios', () => {
    describe('confirm button', () => {
      it('button should be disabled', waitForAsync(() => {
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          const button = fixture.debugElement.query(By.css('button:last-of-type'));

          expect(button.attributes['disabled']).toBeTruthy();
        });
      }));
    });
  });

  describe('close button', () => {
    it('close button should close dialog', () => {
      spyOn(component.dialogRef, 'close');

      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.click();

      expect(component.dialogRef.close).toHaveBeenCalled();
    });
  });
});
