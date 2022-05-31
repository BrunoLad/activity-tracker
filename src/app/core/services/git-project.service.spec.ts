import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { GitProjectService } from './git-project.service';

describe('GitProjectService', () => {
  let service: GitProjectService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(GitProjectService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isPipelineRunning', () => {
    it('method makes expected call', () => {
      service.isPipelineRunning().subscribe(res => {});
      const request = httpController.expectOne(`${environment.apiUrl}/project/pipeline/running`);
      expect(request.request.method).toEqual('GET');
      request.flush(false);

      httpController.verify();
    });
  });
});
