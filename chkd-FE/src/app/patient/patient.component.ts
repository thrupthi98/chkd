import { Component, OnInit } from '@angular/core';
import io from "socket.io-client";
import { Router } from '@angular/router';
import { SurgeryService } from 'src/services/Surgery.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { ChatAdapter, ChatParticipantStatus, ChatParticipantType, IChatController} from 'ng-chat';
import { PatientMessageAdapter } from '../adapter/patient-msg-adapter';
import { MessagesService } from 'src/services/Messages.service';
import { ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class PatientComponent implements OnInit {

  @ViewChild('ngChatInstance') protected ngChatInstance: IChatController;

  private url = 'http://18.220.186.21:3000';
  private socket;

  public adapter: ChatAdapter;
  userId;

  patientDetails: any = [];
  patient;
  upcoming: Boolean = true;

  selectedIndex = 0;

  tableColumns = ['action','type','surgeon','date','time','venue','status']
  expandedElement: TableData | null;

  statusNames = ['Surgery Scheduled','Patient Checked in','Patient In Surgery', 'Post Surgery', 'Patient Discharged'];
  statusIcons = ['alarm_on','weekend','airline_seat_flat','accessible','check_circle'];
  currentStatus: any = [];
  surgeryIds: any = [];
  messageNumbers: any = [];

  constructor(
    private surgeryService: SurgeryService,
    private router: Router,
    private messageService: MessagesService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {

    this.socket = io.connect(this.url);

    this.surgeryService.getPatientSurgery().subscribe((res)=>{
      this.patientDetails = res['data']
      
      for(var data of this.patientDetails){
        this.currentStatus.push(this.statusNames.indexOf(data.status))
        this.surgeryIds.push(data.id)
        this.messageNumbers.push(0)
      }

      this.messageService.getMsgsCnt().subscribe((res)=>{
        res['data'].forEach(element => {
          if(this.surgeryIds.indexOf(element.id.split(",")[1]) != -1){
            this.messageNumbers[this.surgeryIds.indexOf(element.id.split(",")[1])] = element.count
          }
        });
      },(err)=>{
        console.log("error")
      })

      this.patient = res['name']


      this.socket.on(this.patientDetails[0].pt_id, (data) => {
        if(data['data']['toId'] != undefined && data['data']['toId'] != null){
          if(this.ngChatInstance !== undefined){
            this.ngChatInstance.triggerCloseChatWindow(data['data']['toId'])
          }
          this.messageNumbers[this.surgeryIds.indexOf(data['data']['toId'])]++
        }else{
          this.currentStatus[this.surgeryIds.indexOf(data['data']['id'])] = this.statusNames.indexOf(data['data']['status'])
        }
      });

      this.patientDetails.forEach(item => {
        item.date = new Date(item.dateTime).toLocaleDateString("en-US")
        item.time = new Date(item.dateTime).toLocaleTimeString("en-US")
      });

    }, (err)=>{
      console.log(err)
      // if(err.error.status == "NOT_FOUND"){
      //   this.patientDetails = []
      //   console.log("not_found")
      // }else{
      // this.router.navigateByUrl("/")
      // }
    })
  }

  showPrevious(){
    this.upcoming = !this.upcoming
    if(this.upcoming){
      this.surgeryService.getPatientSurgery().subscribe((res)=>{
        this.patientDetails = res['data']
        
        for(var data of this.patientDetails){
          this.currentStatus.push(this.statusNames.indexOf(data.status))
          this.surgeryIds.push(data.id)
        }
  
        this.patient = res['name']
  
        this.socket.on(this.patientDetails[0].pt_id, (data) => {
          this.currentStatus[this.surgeryIds.indexOf(data['data']['id'])] = this.statusNames.indexOf(data['data']['status'])
        });
  
        this.patientDetails.forEach(item => {
          item.date = new Date(item.dateTime).toLocaleDateString("en-US")
          item.time = new Date(item.dateTime).toLocaleTimeString("en-US")
        });
  
      }, (err)=>{
      })
    }else{
      this.surgeryService.getPatientPreviousSurgery().subscribe((res)=>{
        this.patientDetails = res['data']
        this.patientDetails.forEach(item => {
          item.date = new Date(item.dateTime).toLocaleDateString("en-US")
          item.time = new Date(item.dateTime).toLocaleTimeString("en-US")
        });
  
      }, (err)=>{
        if(err.error.status == "NOT_FOUND"){
          this.patientDetails = []
          console.log("not_found")
        }else{
        this.router.navigateByUrl("/")
        }
      })
    }
  }

  prev(){
    this.selectedIndex --;
  }

  next(){
    this.selectedIndex ++;
  }

  async openChat(id,type){
    this.userId = id;
    this.messageNumbers[this.surgeryIds.indexOf(id)] = 0
    let user = {
      participantType: ChatParticipantType.User,
      id: 999,
      displayName: type,
      avatar: "",
      status: ChatParticipantStatus.Online
      };
      this.adapter = await new PatientMessageAdapter(this.messageService, id, this.http);
      setTimeout(()=>{
        this.ngChatInstance.triggerOpenChatWindow(user);
      },500)
      this.messageService.clearMsgsCnt('999,'+id).subscribe((res)=>{}, (err)=>{
        console.log(err)
      })
  }

  // check(){
  //   this.adapter = new PatientMessageAdapter(this.messageService, "abc");
  // }

}

export interface TableData {
  type:string;
  surgeon: string;
  venue: string;
  date: string;
  time: string;
  status: string;
  prescription: string;
  instructions: string;
}
