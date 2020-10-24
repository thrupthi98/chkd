import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import {Config} from '../config/Config'
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService{
    
    public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    // public userData:any;
    // private userRecord: BehaviorSubject<any> = new BehaviorSubject<any>(this.userData);
    
    // public getUserRecord(): Observable<any> {
    //   return this.userRecord;
    // }
  
    // public setUserRecord(data): void {
    //   this.userData = data
    //   this.userRecord.next(this.userData)
    // }
}
