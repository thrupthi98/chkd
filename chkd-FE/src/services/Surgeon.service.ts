import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import {Config} from '../config/Config'

@Injectable({
    providedIn: 'root'
})
export class SurgeonService{
    baseUri = Config.surgeon;

    constructor(private http: HttpClient) {}

    createSurgeon(data){
        return this.http.post(this.baseUri, data)
    }

    getAllSurgeons(){
        return this.http.get(this.baseUri)
    }
}