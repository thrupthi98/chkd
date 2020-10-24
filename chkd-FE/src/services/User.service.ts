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

    getPatients(contact){
        return this.http.get(`${this.baseUri}/patients/${contact}`)
    }

    getPatientById(id){
        return this.http.get(`${this.baseUri}/patientbyid/${id}`)
    }

    getPatientDetails(){
        return this.http.get(`${this.baseUri}/patientdetails`,{
            headers: {
                "Content-Type": "application/json",
                "X-auth-header": localStorage.getItem("UUID"),
              },
        }) 
    }
}