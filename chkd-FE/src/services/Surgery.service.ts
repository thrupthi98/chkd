import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import {Config} from '../config/Config'

@Injectable({
    providedIn: 'root'
})
export class SurgeryService{
    baseUri = Config.baseUrl;

    constructor(private http: HttpClient) {}

    createSurgery(data){
        return this.http.post(this.baseUri, data)
    }

    getAllSurgery(){
        return this.http.get(this.baseUri)
    }

    getSurgeryById(id){
        return this.http.get(`${this.baseUri}/getId/${id}`)
    }

    updateSurgery(id, updateData){
        return this.http.put(`${this.baseUri}/update/${id}`, updateData)
    }

    deleteById(id){
        return this.http.delete(`${this.baseUri}/delete/${id}`)
    }
}