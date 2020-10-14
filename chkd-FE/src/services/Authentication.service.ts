import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import {Config} from '../config/Config'

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    baseUri = Config.access;

    constructor(private http: HttpClient) {}

    checkAccess(url){
        return this.http.get(this.baseUri,{
            headers: {
                "Content-Type": "application/json",
                "X-auth-header": localStorage.getItem("UUID"),
                "URL": url
              },
        })
    }
}