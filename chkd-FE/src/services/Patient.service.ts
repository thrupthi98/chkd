import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import {Config} from '../config/Config'

@Injectable({
    providedIn: 'root'
})
export class PatientService{
    baseUri = Config.patient;

    constructor(private http: HttpClient) {}

    registerPatient(data){
        return this.http.post(this.baseUri, data)
    }

    loginPatient(id){
        return this.http.post(`${this.baseUri}/login`, id)
    }

    getPatientById(id){
       return this.http.get(`${this.baseUri}/id`, { 
            headers: {
                "Content-Type": "application/json",
                "X-auth-header": id
            }
        })
    }

    getPatientByContact(phNo){
        return this.http.get(`${this.baseUri}/contact`, { 
             headers: {
                 "Content-Type": "application/json",
                 "X-auth-header": phNo
             }
         })
     }

}