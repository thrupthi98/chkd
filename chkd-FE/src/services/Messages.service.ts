import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import {Config} from '../config/Config'

@Injectable({
    providedIn: 'root'
})
export class MessagesService{
    baseUri = Config.messages;

    constructor(private http: HttpClient) {}

    sendMessages(data:any,socket:any):void{
        socket.emit('sendMessage', data);
    }

}