import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import {Config} from '../config/Config'

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService{
    baseUri = Config.analytics;

    constructor(private http: HttpClient) {}

    getAverageTime(name){
        return this.http.get(`${this.baseUri}/average/${name}`)
    }

    getMaxTime(name){
        return this.http.get(`${this.baseUri}/max/${name}`)
    }

    getMinTime(name){
        return this.http.get(`${this.baseUri}/min/${name}`)
    }
}