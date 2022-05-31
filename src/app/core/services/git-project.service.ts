import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GitProjectService {
  private apiUrl: string;

  constructor(private httpClient: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  public isPipelineRunning(): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.apiUrl}/project/pipeline/running`);
  }
}
