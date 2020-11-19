import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import {Config} from '../config/Config'
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService{
    private messageSource = new BehaviorSubject('');
    currentMessage = this.messageSource.asObservable();

    constructor() { }

    changeMessage(message: string) {
        console.log(message)
        this.messageSource.next(message)
    }
}
