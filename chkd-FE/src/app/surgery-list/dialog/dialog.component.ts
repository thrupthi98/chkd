import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SurgeryService } from 'src/services/Surgery.service';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { map, startWith } from "rxjs/operators";
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { KywdsService } from 'src/services/Kywds.service';
import { UserService } from 'src/services/User.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  types: any = [
    {value: 'Orthopedic Surgery'},
    {value: 'Inguinal Hermia'},
    {value: 'Adenotonsillectomy Surgery'}
  ];

  selected;
  
  surgeryForm:FormGroup;
  invalidForm:Boolean = false;

  venueList:any;
  surgeonList:any;
  typeList:any;
  patientList: any;

  filteredSurgerykywds:Observable<string[]>;
  filteredVenuekywds:Observable<string[]>;
  filteredSurgeonkywds:Observable<string[]>;
  filteredPatientkywds:Observable<string[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private surgeryService: SurgeryService,
    private dialog: MatDialog,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.venueList = this.data.venueList;
    this.surgeonList = this.data.surgeonList;
    this.typeList = this.data.typeList;

    this.surgeryForm = this.fb.group({
      type:["",Validators.required],
      date:["",Validators.required],
      time:["",Validators.required],
      surgeon:["",Validators.required],
      venue:["",Validators.required],
      patient:["",Validators.required],
      patientAge:["",Validators.required],
      prescription:[""],
      instructions:[""]
    })

    if(this.data.name == 'edit'){
      this.surgeryService.getSurgeryById(this.data.id).subscribe(result => {
        let receviedData = result['data'];
        this.selected = receviedData['type'];
        this.surgeryForm = this.fb.group({
          type:[receviedData['type'],Validators.required],
          date:[new Date(receviedData['date']),Validators.required],
          time:[new Date(receviedData['date'] + " " + receviedData['time']),Validators.required],
          surgeon:[receviedData['surgeon'],Validators.required],
          venue:[receviedData['venue'],Validators.required],
          patient:[receviedData['patient'],Validators.required],
          patientAge:[receviedData['patientAge'],[Validators.required, Validators.max(100)]],
          prescription:[receviedData['prescription']],
          instructions:[receviedData['instructions']]
        })
      })
    }

    this.userService.getPatients().subscribe((res)=>{
      this.patientList = res['data'];

      this.filteredPatientkywds = this.surgeryForm.controls.patient.valueChanges.pipe(startWith(''), map(value => 
        this.doPatientFilter(value)
      ));
    }, (err)=>{
      console.log("error")
    })

    this.filteredSurgerykywds = this.surgeryForm.controls.type.valueChanges.pipe(startWith(''), map(value => 
      this.doSurgeryFilter(value)
    ));

    this.filteredSurgeonkywds = this.surgeryForm.controls.surgeon.valueChanges.pipe(startWith(''), map(value => 
      this.doSurgeonFilter(value)
    ));

    this.filteredVenuekywds = this.surgeryForm.controls.venue.valueChanges.pipe(startWith(''), map(value => 
      this.doVenueFilter(value)
    ));
  
  }

  doPatientFilter(value){
    let result =this.patientList.filter(option => 
      option.fname.toString().toLowerCase().includes(value.toLowerCase())
      || option.lname.toString().toLowerCase().includes(value.toLowerCase())
    );
    return result
  }

  doSurgeryFilter(value){
    let result =this.typeList.filter(option => 
      option.toString().toLowerCase().includes(value.toLowerCase())
    );
    return result
  }

  doSurgeonFilter(value){
    let result =this.surgeonList.filter(option => 
      option.fname.toString().toLowerCase().includes(value.toLowerCase())
      || option.lname.toString().toLowerCase().includes(value.toLowerCase())
    );
    return result
  }

  doVenueFilter(value){
    let result =this.venueList.filter(option => 
      option.toString().toLowerCase().includes(value.toLowerCase())
    );
    return result
  }

  submitForm(){
    if(this.surgeryForm.invalid){
      this.invalidForm = true 
      return false;
    }else{
      this.invalidForm = false
      this.surgeryService.createSurgery({
        type:this.surgeryForm.controls.type.value,
        date:this.surgeryForm.controls.date.value.toLocaleDateString('en-US'),
        time:this.surgeryForm.controls.time.value.toLocaleTimeString('en-US'),
        surgeon:this.surgeryForm.controls.surgeon.value,
        venue:this.surgeryForm.controls.venue.value,
        patient:this.surgeryForm.controls.patient.value,
        patientAge:this.surgeryForm.controls.patientAge.value,
        prescription:this.surgeryForm.controls.prescription.value,
        instructions:this.surgeryForm.controls.instructions.value,
      }).subscribe((res)=>{
        Swal.fire({
          text: "Surgery created successfully",
          icon: "success"
        }).then(result =>{
          location.reload()
        })
      },(err)=>{
        Swal.fire({
          text: "There was an error while creating the surgery",
          icon: "error"
        })
      })
    }
  }

  updateForm(){
    if(this.surgeryForm.invalid){
      this.invalidForm = true 
      return false;
    }else{
      this.invalidForm = false
      this.surgeryService.updateSurgery(this.data.id, {
        type:this.surgeryForm.controls.type.value,
        date:this.surgeryForm.controls.date.value.toLocaleDateString('en-US'),
        time:this.surgeryForm.controls.time.value.toLocaleTimeString('en-US'),
        surgeon:this.surgeryForm.controls.surgeon.value,
        venue:this.surgeryForm.controls.venue.value,
        patient:this.surgeryForm.controls.patient.value,
        patientAge:this.surgeryForm.controls.patientAge.value,
        prescription:this.surgeryForm.controls.prescription.value,
        instructions:this.surgeryForm.controls.instructions.value,
      }).subscribe((res)=>{
        Swal.fire({
          text: "Surgery updated successfully",
          icon: "success"
        }).then(result =>{
          location.reload()
        })
      },(err)=>{
        Swal.fire({
          text: "There was an error while updating the surgery",
          icon: "error"
        })
      })
    }
  }

  filter(evt){
    console.log(evt.target.value)
    if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57)
    {
        evt.preventDefault();
    }
  }

  closeDialog(){
    this.dialog.closeAll();
  }

}
