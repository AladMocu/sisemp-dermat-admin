import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  // tslint:disable-next-line:typedef
  public getAllApointments(){
    return this.httpClient.get('/api/citas');
  }

  // tslint:disable-next-line:typedef
  public addAppointment(appointment: any){
    console.log('llego aca');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      })
    };
    const d = new URLSearchParams(Object.entries(appointment)).toString();
    console.log(d);
    return this.httpClient.put('/api/citas', d, httpOptions).pipe();
  }
}
