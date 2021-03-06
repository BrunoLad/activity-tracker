import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Priority } from 'src/app/shared/enums/priority.enum';
import { Status } from 'src/app/shared/enums/status.enum';
import { Activity } from 'src/app/shared/models/activity';
import { ActivityBuilder } from 'src/app/shared/models/activity-builder';

import { UpdateActivityComponent } from './update-activity.component';

describe('UpdateActivityComponent', () => {
  let component: UpdateActivityComponent;
  let fixture: ComponentFixture<UpdateActivityComponent>;

  const matDialogRefStub = () => ({ close: () => ({}) });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ UpdateActivityComponent ],
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
        { provide: MatDialogRef, useFactory: matDialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: { activity: new Activity(), status: 'In Progress' } },
        { provide: ActivityBuilder, useValue: ActivityBuilder.init() }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('StatusEnum', () => {
    it('getter works correctly and returns enum', () => {
      const value = component.StatusEnum;

      expect(typeof value ).toBe(typeof Status);
    });
  });

  describe('updateActivity', () => {
    it('should close dialog with new activity object', () => {
      const builder = TestBed.inject(ActivityBuilder);
      component.activity = {
        watchers: [],
        topicId: 1
      };

      spyOn(component.dialogRef, 'close');
      spyOn(builder, 'build').and.returnValue(new Activity());

      component.updateActivity();

      expect(component.dialogRef.close).toHaveBeenCalledOnceWith(new Activity());
    });
  });

  describe('template scenarios', () => {
    describe('confirm button', () => {
      it('should be disabled on component initialization', () => {
        const button = fixture.debugElement.query(By.css('button:last-of-type'));

        expect(button.attributes['disabled']).toBeTruthy();
      });

      it('should be enabled after fields are filled out', () => {
        spyOn(component, 'updateActivity');
        component.updateForm.patchValue({
          description: 'a',
          priority: Priority.MEDIUM,
          status: Status.to_do.toString()
        });
        component.updateForm.updateValueAndValidity();
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('button:last-of-type'));
        button.nativeElement.click();

        expect(button.attributes['disabled']).toBeFalsy();
        expect(component.updateActivity).toHaveBeenCalled();
      });
    });
  });

  describe('close button', () => {
    it('should close dialog on click', () => {
      spyOn(component.dialogRef, 'close');

      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.click();

      expect(component.dialogRef.close).toHaveBeenCalled();
    });
  });
});
