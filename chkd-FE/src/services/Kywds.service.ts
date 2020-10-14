import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import {Config} from '../config/Config'

@Injectable({
    providedIn: 'root'
})
export class KywdsService{
    baseUri = Config.keywds;

    constructor(private http: HttpClient) {}

    getKywds(){
        return this.http.get(this.baseUri)
    }

    updateKywds(data){
        return this.http.put(this.baseUri,data)
    }
}