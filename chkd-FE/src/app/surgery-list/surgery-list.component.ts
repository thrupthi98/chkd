import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SurgeryService } from 'src/services/Surgery.service';
import { DialogComponent } from './dialog/dialog.component';
import { map, startWith } from "rxjs/operators";
import Swal from 'sweetalert2';
import { KywdsService } from 'src/services/Kywds.service';
import { LoginService } from 'src/services/Login.service';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/Authentication.service';
import { SurgeryTypeService } from 'src/services/SurgeryType.service';
import { SurgeonService } from 'src/services/Surgeon.service';
import { ResetPassComponent } from '../reset-pass/reset-pass.component';

@Component({
  selector: 'app-surgery-list',
  templateUrl: './surgery-list.component.html',
  styleUrls: ['./surgery-list.component.css']
})
export class SurgeryListComponent implements OnInit {

  surgeryList:any = [];
  newList:any = [];
  sortedList:any = [];
  surgeon;

  selectedIndex = 0;

  date = new FormControl(new Date());

  constructor(
    public dialog: MatDialog,
    private surgeryService: SurgeryService,
    private router: Router,
    private authenticationService: AuthService
  ) { }

  ngOnInit(): void {
  
  var url = this.router.url;

  this.authenticationService.checkAccess(url).subscribe((res)=>{  
    this.surgeryService.getSurgeonSurgery((this.date.value).toLocaleDateString('en-US')).subscribe((res)=>{
      this.surgeryList = res['data']
      this.surgeon = res['name']

      this.surgeryList.forEach(item => {
        item.date = new Date(item.dateTime).toLocaleDateString("en-US")
        item.time = new Date(item.dateTime).toLocaleTimeString("en-US")
      });
    },(err)=>{
      console.log("error")
    })

  },(err)=>{
    if(err.error != undefined && err.error.status == "UN_AUTHORISED"){
      this.router.navigateByUrl("/no-access")
    }else{
      this.router.navigateByUrl("/")
    }
  })
}

prev(){
  this.selectedIndex --;
}

next(){
  this.selectedIndex ++;
}
}
