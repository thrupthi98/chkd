import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SurgeryService } from 'src/services/Surgery.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/Authentication.service';
import { ChatAdapter, ChatParticipantStatus, ChatParticipantType, IChatController } from 'ng-chat';
import io from "socket.io-client";
import { MessagesService } from 'src/services/Messages.service';
import { PatientService } from 'src/services/Patient.service';
import { MessageAdapter } from '../adapter/message-adapter';
import { HttpClient } from '@angular/common/http';
import { MatCalendar, MatCalendarCellCssClasses } from '@angular/material/datepicker';


@Component({
  selector: 'app-surgery-list',
  templateUrl: './surgery-list.component.html',
  styleUrls: ['./surgery-list.component.css']
})
export class SurgeryListComponent implements OnInit {

  @ViewChild('ngChatInstance') protected ngChatInstance: IChatController;

  public adapter: ChatAdapter;
  userId = 999;

  private Soketurl = 'http://18.220.186.21:3000';
  private socket;

  surgeryList:any = [];
  newList:any = [];
  sortedList:any = [];
  surgeon;

  selectedIndex = 0;

  date = new FormControl(new Date());

  datesToHighlight = [];

  constructor(
    public dialog: MatDialog,
    private surgeryService: SurgeryService,
    private router: Router,
    private authenticationService: AuthService,
    private messagesService : MessagesService,
    private patientService: PatientService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  
    this.socket = io.connect(this.Soketurl);
    var url = this.router.url;

  this.authenticationService.checkAccess(url).subscribe((res)=>{  

    this.surgeryService.getSurgeryDates().subscribe((res)=>{
      var data = res['data']
      data.forEach(ele => {
        var date = new Date(ele.dateTime)
        this.datesToHighlight.push(date)
      });
    }, (err)=>{
      console.log(err)
    })

    console.log(this.datesToHighlight)
    this.getSurgery();

    this.socket.on(999, (data) => {
      if(this.ngChatInstance != undefined){
        this.ngChatInstance.triggerCloseChatWindow(data['data']['fromId'])
      }
      this.surgeryList.forEach(element => {
        if(element.id == data['data']['fromId']){
          console.log(element['messages'])
          element['messages'] ++;
        }
      });
    });

  },(err)=>{
    if(err.error != undefined && err.error.status == "UN_AUTHORISED"){
      this.router.navigateByUrl("/no-access")
    }else{
      this.router.navigateByUrl("/")
    }
  })
}

dateClass() {
  return (date: Date): MatCalendarCellCssClasses => {
    const highlightDate = this.datesToHighlight
      .map(strDate => new Date(strDate))
      .some(d => d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear());
    
    return highlightDate ? 'special-date' : '';
  };
}

prev(){
  this.selectedIndex --;
}

next(){
  this.selectedIndex ++;
}

getSurgery(){
  this.surgeryService.getSurgeonSurgery((this.date.value).toLocaleDateString('en-US')).subscribe((res)=>{
    this.surgeryList = res['data']
    this.surgeon = res['name']

    this.surgeryList.forEach(item => {
      item.date = new Date(item.dateTime).toLocaleDateString("en-US")
      item.time = new Date(item.dateTime).toLocaleTimeString("en-US")
      item['messages'] = 0
    });

    this.messagesService.getMsgsCnt().subscribe((res)=>{
      res['data'].forEach(element => {
        if(element.id.split(',')[0] != '999'){
          this.surgeryList.forEach(item => {
            if(item.id == element.id.split(',')[0]){
              console.log(element.count)
              item['messages'] = element.count
            }
          });
        }
      });
    },(err)=>{
      console.log("error")
    })
  },(err)=>{
    console.log("error")
  })
}

openChatWindow(id,surgery,patientFname, patientLname){
  this.surgeryList.forEach(element => {
    if(element.id == id){
      element['messages']= 0;
    }
  });
  let user = {
    participantType: ChatParticipantType.User,
    id: id,
    displayName: patientFname+" "+patientLname+"("+surgery+")",
    avatar: "https://i.stack.imgur.com/ZQT8Z.png",
    status: ChatParticipantStatus.Online
    };
  this.adapter = new MessageAdapter(this.patientService, this.messagesService, this.http, id);
  setTimeout(()=>this.ngChatInstance.triggerOpenChatWindow(user), 500);
  this.messagesService.clearMsgsCnt(id+',999', this.socket).subscribe((res)=>{}, (err)=>{
    console.log(err)
  })
}

}
