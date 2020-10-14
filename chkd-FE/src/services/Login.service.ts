import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import {Config} from '../config/Config'

@Injectable({
    providedIn: 'root'
})
export class LoginService{
    baseUri = Config.login;

    constructor(private http: HttpClient) {}

    loginAdmin(data){
        return this.http.post(this.baseUri, data)
    }

    logoutAdmin(id){
        return this.http.delete(`${this.baseUri}/logout/${id}`)
    }

    resetPassword(data){
        return this.http.put(this.baseUri, data,{
            headers: {
              "Content-Type": "application/json",
              "X-auth-header": localStorage.getItem("UUID"),
            },
        })
    }

}