import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from 'src/app/shared/models/activity';
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

  public createActivity(activity: Activity): Observable<Activity> {
    return this.httpClient.post<Activity>(`${this.api}/activities`, activity);
  }

  public updateActivity(activity: any): Observable<Activity> {
    return this.httpClient.put<Activity>(`${this.api}/activities`, activity);
  }

  public getActivities(topic: number, status: any): Observable<Activity[]> {
    const params = new HttpParams()
      .set('status', status)
      .set('topicId', topic);

    return this.httpClient.get<Activity[]>(`${this.api}/activities`, { params });
  }

  public getActivity(topic: string, status: any, fileName: string): Observable<Activity> {
    const params = new HttpParams({
      fromObject: {
        topic,
        status,
        fileName
      }
    });

    return this.httpClient.get<Activity>(`${this.api}/activities/item`, { params });
  }
}
