import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import {Config} from '../config/Config'

@Injectable({
    providedIn: 'root'
})
export class UserService{
    baseUri = Config.user;

    constructor(private http: HttpClient) {}

    registerUser(data){
        return this.http.post(this.baseUri, data)
    }
}