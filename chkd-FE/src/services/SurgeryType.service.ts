import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import {Config} from '../config/Config'

@Injectable({
    providedIn: 'root'
})
export class SurgeryTypeService{
    baseUri = Config.surgeryType;

    constructor(private http: HttpClient) {}

    createSurgeryType(data){
        return this.http.post(this.baseUri, data)
    }

    getAllSurgeryTypes(){
        return this.http.get(this.baseUri)
    }
}