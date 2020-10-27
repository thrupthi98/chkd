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

  types: any = [
    {value: 'Surgery Type'},
    {value: 'Surgeon Name'},
    {value: 'Venue'}
  ];

  role;

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

  venuList:any;
  surgeonList:any;
  typeList: any = [];

  filteredSurgerykywds: Observable<string[]>;
  filteredSurgeonkywds: Observable<string[]>;
  filteredVenuekywds: Observable<string[]>;

  constructor(
    public dialog: MatDialog,
    private surgeryService: SurgeryService,
    private kywdsService: KywdsService,
    private loginService: LoginService,
    private router: Router,
    private authenticationService: AuthService,
    private surgeryTypeservice : SurgeryTypeService,
    private surgeonService : SurgeonService
  ) { }

  ngOnInit(): void {
  
  var url = this.router.url;

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
      this.newList = this.surgeryList;
      this.sortedList = this.newList.slice();
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

  sortData(sort: Sort) {
    const data = this.newList.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedList = data;
      return;
    }

    this.sortedList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date': return this.compare(a.name, b.name, isAsc);
        case 'time': return this.compare(a.calories, b.calories, isAsc);
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

  showPrevious(){
    this.upcoming = !this.upcoming
    if(this.upcoming){
        this.surgeryService.getUpcomingSurgery().subscribe((res)=>{
        this.surgeryList = res['data']
        this.newList = this.surgeryList
        this.sortedList = this.newList.slice();
      },(err)=>{
        console.log("error")
      })
    }else{
      this.surgeryService.getPreviousSurgery().subscribe((res)=>{
        this.surgeryList = res['data']
        this.newList = this.surgeryList
        this.sortedList = this.newList.slice();
      },(err)=>{
        console.log("error")
      })
    }
  }

  show(index){
    if(document.getElementById(index).style.display == "grid"){
    document.getElementById(index).style.display = "none"
    document.getElementById("more"+index).style.display = "inline"
    document.getElementById("less"+index).style.display = "none"
    }else{
    document.getElementById(index).style.display = "grid"
    document.getElementById("more"+index).style.display = "none"
    document.getElementById("less"+index).style.display = "inline"
    }
  }

  searchFilter(){
    this.newList = [];
      var filterValue = this.search.value;
      var surgeryTypeValue = this.surgery.value;
      var surgeonNameValue = this.surgeon.value;
      var venueValue = this.venue.value;
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
    this.newList = this.surgeryList.filter(option =>
        option.type.toLowerCase().includes(surgeryTypeValue.toLowerCase())
      && option.surgeon.toLowerCase().includes(surgeonNameValue.toLowerCase())
      && option.venue.toLowerCase().includes(venueValue.toLowerCase())
      && (
        option.surgeon.toLowerCase().includes(filterValue.toLowerCase())
      || option.type.toLowerCase().includes(filterValue.toLowerCase())
      || option.venue.toLowerCase().includes(filterValue.toLowerCase())
      || option.date.toLowerCase().includes(filterValue.toLowerCase())
      || option.time.toLowerCase().includes(filterValue.toLowerCase())
      || option.patient.toLowerCase().includes(filterValue.toLowerCase())
      )
    )
    this.sortedList = this.newList;
  }

  openDialog(name,id){
    if(name == 'edit'){
      this.dialog.open(DialogComponent, {
        data: {name:'edit', id:id, venueList:this.venuList, surgeonList: this.surgeonList, typeList: this.typeList},
        disableClose: true
      });
    }else if(name == 'create'){
    this.dialog.open(DialogComponent, {
      data: {name:'create', id:'all', venueList:this.venuList, surgeonList: this.surgeonList, typeList: this.typeList},
      disableClose: true
    });
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
            location.reload();
          })
        },err=>{
          console.log("error");
        })
      }
    })
  }

  logout(){
    this.loginService.logoutAdmin(localStorage.getItem("UUID")).subscribe((res)=>{
      localStorage.removeItem("UUID")
      this.router.navigateByUrl('/')
    },(err)=>{
      Swal.fire({
        text: "There was a problem during logout",
        icon:"error"
      })
    })
  }
}
