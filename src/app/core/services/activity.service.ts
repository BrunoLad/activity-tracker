import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateActivity } from 'src/app/shared/models/create-activity';
import { SelectedActivity } from 'src/app/shared/models/selected-activity';
import { UpdateActivity } from 'src/app/shared/models/update-activity';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  public api: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.api = environment.apiUrl;
  }

  public createActivity(activity: CreateActivity): Observable<CreateActivity> {
    return this.httpClient.post<CreateActivity>(`${this.api}/activities`, activity);
  }

  public updateActivity(activity: any): Observable<UpdateActivity> {
    return this.httpClient.put<UpdateActivity>(`${this.api}/activities`, activity);
  }

  public getActivities(topic: string, status: any): Observable<SelectedActivity[]> {
    const params = new HttpParams()
      .set('status', status)
      .set('topic', topic);
    
    return this.httpClient.get<SelectedActivity[]>(`${this.api}/activities/all`, { params });
  }

  public getActivity(topic: string, status: any, fileName: string): Observable<SelectedActivity> {
    const params = new HttpParams({
      fromObject: {
        topic,
        status,
        fileName
      }
    });

    return this.httpClient.get<SelectedActivity>(`${this.api}/activities/item`, { params });
  }
}
