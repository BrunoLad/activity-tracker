import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CreateActivity } from 'src/app/shared/models/create-activity';
import { environment } from 'src/environments/environment';

import { ActivityService } from './activity.service';

describe('ActivityService', () => {
  let service: ActivityService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(ActivityService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createActivity', () => {
    it('makes expected call', () => {
      const response = {};
      const activity = new CreateActivity();

      service.createActivity(activity).subscribe(response => {});
      const request = httpController.expectOne(`${environment.apiUrl}/activities`);
      expect(request.request.method).toBe('POST');
      request.flush(response);

      httpController.verify();
    });
  });

  describe('updateActivity', () => {
    it('makes expected call', () => {
      const response = {};
      const activity = {};

      service.updateActivity(activity).subscribe(response => {});
      const request = httpController.expectOne(`${environment.apiUrl}/activities`);
      expect(request.request.method).toBe('PUT');
      request.flush(response);

      httpController.verify();
    });
  });

  describe('getActivities', () => {
    it('makes expected call', () => {
      const response = {};
      const topic = 'topic';
      const status = 'in_progress';

      service.getActivities(topic, status).subscribe(response => {});
      const request = httpController.expectOne(`${environment.apiUrl}/activities/all?status=${status}&topic=${topic}`);
      expect(request.request.method).toBe('GET');
      request.flush(response);

      httpController.verify();
    });
  });

  describe('getActivity', () => {
    it('makes expected call', () => {
      const response = {};
      const topic = 'topic';
      const status = 'to do';
      const fileName = 'aaa.md';

      service.getActivity(topic, status, fileName).subscribe(res => {});
      const request = httpController.expectOne(
        `${environment.apiUrl}/activities/item?topic=${topic}&status=${encodeURIComponent(status)}&fileName=${fileName}`);
      expect(request.request.method).toBe('GET');
      request.flush(response);

      httpController.verify();
    });
  });
});
