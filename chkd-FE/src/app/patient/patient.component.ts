import { Component, OnInit } from '@angular/core';
import io from "socket.io-client";
import { Router } from '@angular/router';
import { SurgeryService } from 'src/services/Surgery.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { ChatAdapter, ChatParticipantStatus, ChatParticipantType, IChatController} from 'ng-chat';
import { PatientMessageAdapter } from '../adapter/patient-msg-adapter';
import { MessagesService } from 'src/services/Messages.service';
import { ViewChild } from '@angular/core';

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

  private url = 'http://localhost:3000';
  private socket;

  public adapter: ChatAdapter;
  userId = 999;

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

  constructor(
    private surgeryService: SurgeryService,
    private router: Router,
    private messageService: MessagesService
  ) { }

  ngOnInit(): void {
    this.adapter = new PatientMessageAdapter(this.messageService);

    this.socket = io.connect(this.url);

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

        console.log(res['name'])
  
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

  openChat(id,type){
    let user = {
      participantType: ChatParticipantType.User,
      id: id,
      displayName: type,
      avatar: "",
      status: ChatParticipantStatus.Online
      };
      this.ngChatInstance.triggerOpenChatWindow(user);
  }

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
