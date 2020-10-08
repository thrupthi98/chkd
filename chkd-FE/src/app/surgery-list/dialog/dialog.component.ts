import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SurgeryService } from 'src/services/Surgery.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import Swal from 'sweetalert2';

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private surgeryService: SurgeryService
  ) { }

  ngOnInit(): void {
    this.selected = "halle";
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
          type:[null,Validators.required],
          date:[new Date(receviedData['date']),Validators.required],
          time:[new Date(receviedData['date'] + " " + receviedData['time']),Validators.required],
          surgeon:[receviedData['surgeon'],Validators.required],
          venue:[receviedData['venue'],Validators.required],
          patient:[receviedData['patient'],Validators.required],
          patientAge:[receviedData['patientAge'],Validators.required],
          prescription:[receviedData['prescription']],
          instructions:[receviedData['instructions']]
        })
      })
    }
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

}
