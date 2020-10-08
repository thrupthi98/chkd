import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SurgeryService } from 'src/services/Surgery.service';
import { DialogComponent } from './dialog/dialog.component';
import { debounceTime, switchMap } from "rxjs/operators";
import { map, startWith } from "rxjs/operators";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-surgery-list',
  templateUrl: './surgery-list.component.html',
  styleUrls: ['./surgery-list.component.css']
})
export class SurgeryListComponent implements OnInit {

  types: any = [
    {value: 'Orthopedic Surgery'},
    {value: 'Inguinal hermia'},
    {value: 'Adenotonsillectomy Surgery'}
  ];
  surgeryList:any = [];
  newList:any = [];
  display:Boolean = false;

  search = new FormControl();
  optionSelected = "";

  filteredkywds: Observable<any[]>;

  searchForm: FormGroup

  constructor(
    public dialog: MatDialog,
    private surgeryService: SurgeryService
  ) { }

  ngOnInit(): void {
    this.surgeryService.getAllSurgery().subscribe((res)=>{
      this.surgeryList = res['data']
      this.newList = this.surgeryList;
    },(err)=>{
      console.log("error")
    })
  }

  openDialog(name,id){
    if(name == 'edit'){
      this.dialog.open(DialogComponent, {
        data: {name:'edit', id:id}
      });
    }else if(name == 'create'){
    this.dialog.open(DialogComponent, {
      data: {name:'create', id:'all'}
    });
    }
  }

  show(index){
    if(document.getElementById(index).style.display == "grid"){
    document.getElementById(index).style.display = "none"
    document.getElementById("more"+index).style.display = "block"
    document.getElementById("less"+index).style.display = "none"
    }else{
    document.getElementById(index).style.display = "grid"
    document.getElementById("more"+index).style.display = "none"
    document.getElementById("less"+index).style.display = "block"
    }
  }

  view(e){
    this.optionSelected = e;
    this.newList = [];
      for(var i in this.surgeryList){
        if(this.surgeryList[i]['type'].toLowerCase().includes(e.toLowerCase())){
          this.newList.push(this.surgeryList[i]);
        }
      }
  }

  filter(){
    this.newList = [];
      const filterValue = this.search.value;
      for(var i in this.surgeryList){
        if(this.optionSelected == ""){
        if(this.surgeryList[i]['type'].toLowerCase().includes(this.search.value.toLowerCase())
        || this.surgeryList[i]['surgeon'].toLowerCase().includes(this.search.value.toLowerCase())
        || this.surgeryList[i]['patient'].toLowerCase().includes(this.search.value.toLowerCase())
        || this.surgeryList[i]['date'].toLowerCase().includes(this.search.value.toLowerCase())
        || this.surgeryList[i]['time'].toLowerCase().includes(this.search.value.toLowerCase())
        || this.surgeryList[i]['venue'].toLowerCase().includes(this.search.value.toLowerCase())){
          this.newList.push(this.surgeryList[i]);
        }
      }else{
        if(this.surgeryList[i]['type'].toLowerCase().includes(this.optionSelected.toLowerCase())
        && (this.surgeryList[i]['type'].toLowerCase().includes(this.search.value.toLowerCase())
        ||this.surgeryList[i]['surgeon'].toLowerCase().includes(this.search.value.toLowerCase())
        || this.surgeryList[i]['patient'].toLowerCase().includes(this.search.value.toLowerCase())
        || this.surgeryList[i]['date'].toLowerCase().includes(this.search.value.toLowerCase())
        || this.surgeryList[i]['time'].toLowerCase().includes(this.search.value.toLowerCase())
        || this.surgeryList[i]['venue'].toLowerCase().includes(this.search.value.toLowerCase()))){
          this.newList.push(this.surgeryList[i]);
        }
      }
    }

    }

    delete(id){
      this.surgeryService.deleteById(id).subscribe(result => {
        location.reload();
      },err=>{
        console.log("error");
      })
    }
  }
