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

    getUpcomingSurgery(){
        return this.http.get(`${this.baseUri}/upcoming`)
    }

    getPreviousSurgery(){
        return this.http.get(`${this.baseUri}/previous`)
    }

    getSurgeryById(id){
        return this.http.get(`${this.baseUri}/getId/${id}`)
    }

    updateStatus(data:any,socket:any):void{
        socket.emit('updateStatus', data);
    }

    updateSurgery(id, updateData){
        return this.http.put(`${this.baseUri}/update/${id}`, updateData)
    }

    deleteById(id){
        return this.http.delete(`${this.baseUri}/delete/${id}`)
    }
}