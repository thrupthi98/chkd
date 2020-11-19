import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, reduce, startWith } from 'rxjs/operators';
import { AuthService } from 'src/services/Authentication.service';
import { KywdsService } from 'src/services/Kywds.service';
import { LoginService } from 'src/services/Login.service';
import { SurgeonService } from 'src/services/Surgeon.service';
import { SurgeryService } from 'src/services/Surgery.service';
import { SurgeryTypeService } from 'src/services/SurgeryType.service';
import Swal from 'sweetalert2';
import { ResetPassComponent } from '../reset-pass/reset-pass.component';
import { DialogComponent } from '../surgery-list/dialog/dialog.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { ChatAdapter, ChatParticipantStatus, ChatParticipantType, IChatController } from 'ng-chat';
import { MessageAdapter } from '../adapter/message-adapter';
import { PatientService } from 'src/services/Patient.service';
import { MessagesService } from 'src/services/Messages.service';
import io from "socket.io-client";
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { element } from 'protractor';
import { DataService } from 'src/services/Data.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminComponent implements OnInit {

  @ViewChild('ngChatInstance') protected ngChatInstance: IChatController;

  public adapter: ChatAdapter;
  userId = 999;

  unreadMsgIds;

  types: any = [
    {value: 'Surgery Type'},
    {value: 'Surgeon Name'},
    {value: 'Venue'}
  ];

  datemask = [/\d/, /\d/,/\d/, '-', /\d/, /\d/,/\d/, '-', /\d/, /\d/, /\d/, /\d/];

  today = new Date();

  tableColumns = ['action','type','surgeon','patient','date','time','venue','status','change']
  expandedElement: TableData | null;

  role;

  patientsData;

  upcoming:Boolean = true;

  surgeryList:any = [];
  newList:any = [];
  sortedList:any = [];

  display:Boolean = false;

  searchForm: FormGroup
  search = new FormControl();
  optionSelected = "";

  displayVenue:Boolean = false;
  displaySurgeon: Boolean = false;
  displayType: Boolean = false;

  surgery = new FormControl();
  surgeon = new FormControl();
  venue = new FormControl();
  dob = new FormControl();
  contact = new FormControl();

  venuList:any;
  surgeonList:any = []
  surgeonIds: any = []
  typeList: any = []

  filteredSurgerykywds: Observable<string[]>;
  filteredSurgeonkywds: Observable<string[]>;
  filteredVenuekywds: Observable<string[]>;

  private Soketurl = 'http://18.220.186.21:3000';
  private socket;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private surgeryService: SurgeryService,
    private kywdsService: KywdsService,
    private surgeryTypeservice : SurgeryTypeService,
    private surgeonService : SurgeonService,
    private loginService: LoginService,
    private router: Router,
    private authenticationService: AuthService,
    private patientService: PatientService,
    private messagesService: MessagesService,
    private http: HttpClient,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.socket = io.connect(this.Soketurl);

    let url = this.router.url;

    this.dataService.currentMessage.subscribe(message => this.unreadMsgIds = message)
    
    console.log(this.unreadMsgIds)
    
  this.authenticationService.checkAccess(url).subscribe((res)=>{
    this.kywdsService.getKywds().subscribe((res)=>{
      this.venuList = res['data'][0].kywds;

      this.filteredVenuekywds = this.venue.valueChanges.pipe(startWith(''), map(value => 
        this.venueFilter(value)
      ));
    },(err)=>{
      console.log('error')
    })

    this.surgeryTypeservice.getAllSurgeryTypes().subscribe((res)=>{
      for(let data of res['data']){
        this.typeList.push(data.type)
      }
      this.filteredSurgerykywds = this.surgery.valueChanges.pipe(startWith(''), map(value => 
        this.surgeryFilter(value)
      ));
    },(err)=>{
      console.log("type-error")
    })

    this.surgeonService.getAllSurgeons().subscribe((res)=>{
      this.surgeonList = res['data'];
      this.filteredSurgeonkywds = this.surgeon.valueChanges.pipe(startWith(''), map(value => 
        this.surgeonFilter(value)
      ));
    },(err)=>{
      console.log("surgeon error")
    })

    this.surgeryService.getUpcomingSurgery().subscribe((res)=>{
      this.surgeryList = res['data']
      this.surgeryList.forEach(item => {
        item.date = new Date(item.dateTime).toLocaleDateString("en-US")
        item.time = new Date(item.dateTime).toLocaleTimeString("en-US")
      });
      this.newList = this.surgeryList
      this.sortedList = this.newList.slice();
      this.sortedList.forEach(element => {
        element['messages'] = 0
      });
      this.messagesService.getMsgsCnt().subscribe((res)=>{
        res['data'].forEach(element => {
          if(element.id.split(',')[0] != '999'){
            this.sortedList.forEach(item => {
              if(item.id == element.id.split(',')[0]){
                item['messages'] = element.count
              }
            });
          }else{
            this.sortedList.forEach(item => {
              if(item.id == element.id.split(',')[1] && element.count != 0){
                document.getElementById(element.id.split(',')[1]).style.color = 'red'
              }
            });
          }
        });
      },(err)=>{
        console.log("error")
      })
    }, (err)=>{
      console.log("error")
    })

    this.socket.on(999, (data) => {
      this.messagesService.getMsgsCnt().subscribe((res)=>{
        console.log(res);
        res['data'].forEach(element => {
          if(element.id.split(',')[0] != '999'){
            this.sortedList.forEach(item => {
              if(item.id == element.id.split(',')[0]){
                item['messages'] = element.count
              }
            });
          }else{
            this.sortedList.forEach(item => {
              if(item.id == element.id.split(',')[1] && element.count != 0){
                document.getElementById(element.id.split(',')[1]).style.color = 'red'
              }
            });
          }
        });
      },(err)=>{
        console.log("error")
      })
      if(this.ngChatInstance != undefined){
        this.ngChatInstance.triggerCloseChatWindow(data['data']['fromId'])
      }
      this.sortedList.forEach(element => {
        if(element.id == data['data']['fromId']){
          element['messages']++;
        }
      });
      this.sortedList.paginator = this.paginator;
    });

  }, (err)=>{
    if(err.error != undefined && err.error.status == "UN_AUTHORISED"){
      this.router.navigateByUrl("/no-access")
    }else{
      this.router.navigateByUrl("/")
    }
  })
}

  sortData(sort: Sort) {
    const data = this.newList.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedList = data;
      return;
    }

    this.sortedList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date': return this.compare(new Date(a.date).getTime(), new Date(b.date).getTime(), isAsc);
        case 'time': return this.compare(a.time, b.time, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  addFilter(evt){
    switch(evt.source.id){
      case "type": 
        if(evt.checked){
          this.displayType = true 
        }else{
          this.displayType = false
          this.surgery.setValue("")
          this.searchFilter();
        }
      break;
      case "surgeon":
        if(evt.checked){
          this.displaySurgeon = true
        }else{
          this.displaySurgeon = false
          this.surgeon.setValue("")
          this.searchFilter();
        }
      break;
      case "venue":
        if(evt.checked){
          this.displayVenue = true
        }else{
          this.displayVenue = false
          this.venue.setValue("")
          this.searchFilter();
        }
      break;
    }
  }

  surgeryFilter(value: string): string[]{
      let result =this.typeList.filter(option => 
        option.toString().toLowerCase().includes(value.toLowerCase())
      );
      return result
  }
  surgeonFilter(value: string): string[]{
      let result =this.surgeonList.filter(option => 
        option.fname.toString().toLowerCase().includes(value.toLowerCase())
        || option.lname.toString().toLowerCase().includes(value.toLowerCase())
      );
      return result
  }
  venueFilter(value: string): string[]{
    let result =this.venuList.filter(option => 
      option.toString().toLowerCase().includes(value.toLowerCase())
    );
    return result
  }

  searchFilter(){
    this.newList = [];
      var filterValue = this.search.value;
      var surgeryTypeValue = this.surgery.value;
      var surgeonNameValue = this.surgeon.value;
      var venueValue = this.venue.value;
      var dobValue = this.dob.value;
      var contactValue = this.contact.value;
      if(filterValue == null || filterValue == undefined){
        filterValue = "";
      }
      if(surgeryTypeValue == null || surgeryTypeValue == undefined){
        surgeryTypeValue = "";
      }
      if(surgeonNameValue == null || surgeonNameValue == undefined){
        surgeonNameValue = "";
      }
      if(venueValue == null || venueValue == undefined){
        venueValue = "";
      }
      if(dobValue == null || dobValue == undefined){
        dobValue = "";
      }else{
        dobValue = new Date(dobValue).toLocaleDateString('en-US').toString()
      }
      if(contactValue == null || contactValue == undefined){
        contactValue = ""
      }
    this.newList = this.surgeryList.filter(option =>
        option.type.toLowerCase().includes(surgeryTypeValue.toLowerCase())
      && option.surgeon.toLowerCase().includes(surgeonNameValue.toLowerCase())
      && option.venue.toLowerCase().includes(venueValue.toLowerCase())
      && option.patientDetails[0].dob.includes(dobValue)
      && option.patientDetails[0].contact.includes(contactValue.split('-').join('').replace(/_/g,''))
      &&(
        option.surgeon.toLowerCase().includes(filterValue.toLowerCase())
      || option.type.toLowerCase().includes(filterValue.toLowerCase())
      || option.venue.toLowerCase().includes(filterValue.toLowerCase())
      || option.date.toLowerCase().includes(filterValue.toLowerCase())
      || option.time.toLowerCase().includes(filterValue.toLowerCase())
      || option.patientDetails[0].fname.toLowerCase().includes(filterValue.toLowerCase())
      || option.patientDetails[0].lname.toLowerCase().includes(filterValue.toLowerCase())
      || option.patientDetails[0].contact.toLowerCase().includes(filterValue.toLowerCase())
      || option.patientDetails[0].dob.toLowerCase().includes(filterValue.toLowerCase())
      )
    )
    this.sortedList = this.newList;
  }

  showPrevious(){
    this.upcoming = !this.upcoming
    if(this.upcoming){
        this.surgeryService.getUpcomingSurgery().subscribe((res)=>{
        this.surgeryList = res['data']
        this.surgeryList.forEach(item => {
          item.date = new Date(item.dateTime).toLocaleDateString("en-US")
          item.time = new Date(item.dateTime).toLocaleTimeString("en-US")
        });
        this.newList = this.surgeryList
        this.sortedList = this.newList.slice();
      },(err)=>{
        console.log("error")
      })
    }else{
      this.surgeryService.getPreviousSurgery().subscribe((res)=>{
        this.surgeryList = res['data']
        this.surgeryList.forEach(item => {
          item.date = new Date(item.dateTime).toLocaleDateString("en-US")
          item.time = new Date(item.dateTime).toLocaleTimeString("en-US")
        });
        this.newList = this.surgeryList
        this.sortedList = this.newList.slice();
      },(err)=>{
        console.log("error")
      })
    }
  }

  openDialog(name,id){
    if(name == 'edit'){
      let edit = this.dialog.open(DialogComponent, {
        data: {name:'edit', id:id, venueList:this.venuList, surgeonList: this.surgeonList, typeList: this.typeList},
        disableClose: true,
        panelClass: "custom-dialog"
      });
      edit.afterClosed().subscribe((result)=>{
        if(result!= undefined)
        this.sortedList.forEach(ele=>{
          if(ele.id == result.response.id){
            ele.type = result.response.type,
            ele.surgeon = result.response.surgeon,
            ele.date = result.response.date,
            ele.time = result.response.time,
            ele.venue = result.response.venue,
            ele.prescription = result.response.prescription,
            ele.instructions = result.response.instructions
          }
        })
      })
    }else if(name == 'create'){
    let create = this.dialog.open(DialogComponent, {
      data: {name:'create', id:'all', venueList:this.venuList, surgeonList: this.surgeonList, typeList: this.typeList},
      disableClose: true,
      panelClass: "custom-dialog"
    });
    create.afterClosed().subscribe((result)=>{
      this.surgeryService.getUpcomingSurgery().subscribe((res)=>{
        this.surgeryList = res['data']
        this.surgeryList.forEach(item => {
          item.date = new Date(item.dateTime).toLocaleDateString("en-US")
          item.time = new Date(item.dateTime).toLocaleTimeString("en-US")
        });
        this.newList = this.surgeryList
        this.sortedList = this.newList.slice();
        this.sortedList.forEach(element => {
          element['messages'] = 0;
        });
        this.messagesService.getMsgsCnt().subscribe((res)=>{
          res['data'].forEach(element => {
            if(element.id.split(',')[0] != '999'){
              this.sortedList.forEach(item => {
                if(item.id == element.id.split(',')[0]){
                  item['messages'] = element.count
                }
              });
            }
          });
        },(err)=>{
          console.log("error")
        })
      }, (err)=>{
        console.log("error")
      })
    })
    }else if(name == 'status'){
      let statusDialog = this.dialog.open(DialogComponent, {
        data: {name:'status', id:id},
        disableClose: true,
        panelClass: "custom-dialog"
      });
      statusDialog.afterClosed().subscribe((result)=>{
        if(result != undefined){
          this.sortedList.forEach(ele=>{
            if(ele.id == result.response.id){
              ele.status = result.response.status
            }
          })
        }
      })
    }
  }

  resetDialog(){
    this.dialog.open(ResetPassComponent,{disableClose: true})
  }

  delete(id){
    Swal.fire({
      text: 'Are you sure you want to delete this content',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: 'red',
      cancelButtonColor: 'green'
    }).then((result) => {
      if (result.value) {
        this.surgeryService.deleteById(id).subscribe(result => {
          Swal.fire(
            "Deleted",
            "Surgery deleted successfully",
          ).then((result)=>{
            this.surgeryService.getUpcomingSurgery().subscribe((res)=>{
              this.surgeryList = res['data']
              this.surgeryList.forEach(item => {
                item.date = new Date(item.dateTime).toLocaleDateString("en-US")
                item.time = new Date(item.dateTime).toLocaleTimeString("en-US")
              });
              this.newList = this.surgeryList
              this.sortedList = this.newList.slice();
              this.sortedList.forEach(element => {
                element['messages'] = 0;
              });
              this.messagesService.getMsgsCnt().subscribe((res)=>{
                res['data'].forEach(element => {
                  if(element.id.split(',')[0] != '999'){
                    this.sortedList.forEach(item => {
                      if(item.id == element.id.split(',')[0]){
                        item['messages'] = element.count
                      }
                    });
                  }
                });
              },(err)=>{
                console.log("error")
              })
            }, (err)=>{
              console.log("error")
            })
          })
        },err=>{
          console.log("error");
        })
      }
    })
  }

  logout(){
    this.loginService.logoutAdmin(sessionStorage.getItem("UUID")).subscribe((res)=>{
      sessionStorage.removeItem("UUID")
      this.router.navigateByUrl("/")
    },(err)=>{
      Swal.fire({
        text: "There was a problem during logout",
        icon:"error"
      })
    })
  }

  openChatWindow(id,surgery,patientFname, patientLname){
    this.sortedList.forEach(element => {
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

export interface TableData {
  type:string;
  surgeon: string;
  patient: string;
  venue: string;
  date: string;
  time: string;
  status: string;
  prescription: string;
  instructions: string;
  patientAge: string;
}
