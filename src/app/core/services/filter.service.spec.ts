import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { FilterService } from './filter.service';

describe('FilterService', () => {
  let service: FilterService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    service = TestBed.inject(FilterService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCategories', () => {
    it('should make expected call', () => {
      const response = {};

      service.getCategories().subscribe(res => {});
      const request = httpController.expectOne(`${environment.apiUrl}/categories`);
      expect(request.request.method).toEqual('GET');
      request.flush(response);

      httpController.verify();
    });
  });

  describe('getTopicsByCategory', () => {
    it('should make expected call', () => {
      const response = {};
      const category = 'category';

      service.getTopicsByCategory(category).subscribe(res => {});
      const request = httpController.expectOne(`${environment.apiUrl}/categories/topics?category=${category}`);
      expect(request.request.method).toEqual('GET');
      request.flush(response);

      httpController.verify();
    });
  });
});
