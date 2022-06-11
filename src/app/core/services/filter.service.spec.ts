import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Category } from 'src/app/shared/models/category';
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
      const category: Category = {
        _links: {
          'topics': {
            href: '/path/to'
          },
        },
        id: 1,
        name: 'category'
      };

      service.getTopicsByCategory(category).subscribe(res => {});
      const request = httpController.expectOne(`${environment.apiUrl}/path/to`);
      expect(request.request.method).toEqual('GET');
      request.flush(response);

      httpController.verify();
    });
  });
});
