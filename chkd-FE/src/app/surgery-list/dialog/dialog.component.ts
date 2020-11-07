import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SurgeryService } from 'src/services/Surgery.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { map, startWith } from "rxjs/operators";
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import io from "socket.io-client";
import { PatientService } from 'src/services/Patient.service';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  private url = 'http://localhost:3000';
  private socket;

  patientId;
  patientDetails;
  names = [];

  types: any = [
    {value: 'Orthopedic Surgery'},
    {value: 'Inguinal Hermia'},
    {value: 'Adenotonsillectomy Surgery'}
  ];

  datemask = [/\d/, /\d/,/\d/, '-', /\d/, /\d/,/\d/, '-', /\d/, /\d/, /\d/, /\d/];

  today = new Date();

  showDetails:Boolean = false;
  showAlert: Boolean = false;
  
  newUser = false;

  temp;

  selected;

  receivedData;
  
  surgeryForm:FormGroup;
  registerForm:FormGroup;
  invalidForm:Boolean = false;

  venueList:any;
  surgeonList:any;
  typeList:any;
  patientList: any;

  filteredSurgerykywds:Observable<string[]>;
  filteredVenuekywds:Observable<string[]>;
  filteredSurgeonkywds:Observable<string[]>;
  filteredPatientkywds:Observable<string[]>;

  statusNames = ['Surgery Scheduled','Patient Checked in','Patient In Surgery', 'Post Surgery', 'Patient Discharged'];
  statusIcons = ['alarm_on','weekend','airline_seat_flat','accessible','check_circle'];
  currentStatus;
  selectedSatus;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private surgeryService: SurgeryService,
    private dialog: MatDialogRef<DialogComponent>,
    private patientService: PatientService,
  ) { }

  ngOnInit(): void {
    this.socket = io(this.url);

    this.venueList = this.data.venueList;
    this.surgeonList = this.data.surgeonList;
    this.typeList = this.data.typeList;

    this.surgeryForm = this.fb.group({
      type:["",Validators.required],
      date:["",Validators.required],
      time:["",Validators.required],
      surgeon:["",Validators.required],
      venue:["",Validators.required],
      prescription:[""],
      instructions:[""],
      contact:["",[Validators.required]],
    })

    this.registerForm = this.fb.group({
      fname:["",Validators.required],
      lname:["",Validators.required],
      dob:["",Validators.required],
      // email:["",[Validators.required, Validators.email]],
    })

    if(this.data.name == 'edit'){
      this.showDetails = true;
      this.surgeryService.getSurgeryById(this.data.id).subscribe(result => {
        this.receivedData = result['data'];
        this.selected = this.receivedData['type'];
        this.patientService.getPatientById(this.receivedData['pt_id']).subscribe((res)=>{
          this.surgeryForm = this.fb.group({
            type:[this.receivedData['type'],Validators.required],
            date:[new Date(this.receivedData['dateTime']),Validators.required],
            time:[new Date(this.receivedData['dateTime']),Validators.required],
            surgeon:[this.receivedData['surgeon'],Validators.required],
            venue:[this.receivedData['venue'],Validators.required],
            prescription:[this.receivedData['prescription']],
            instructions:[this.receivedData['instructions']],
            contact:[{value: res['data'].contact, disabled: true},[Validators.required, Validators.min(1000000000), Validators.max(9999999999)]],
          })

          this.registerForm = this.fb.group({
            fname:[{value: res['data'].fname, disabled:true},Validators.required],
            lname:[{value: res['data'].lname, disabled:true},Validators.required],
            dob:[{value: new Date(res['data'].dob), disabled:true},Validators.required],
            // email:[{value: res['data'].email, disabled:true},[Validators.required, Validators.email]],
          })
        })
      })
    }

    if(this.data.name == 'status'){
      this.surgeryService.getSurgeryById(this.data.id).subscribe(result => {
        this.receivedData = result['data'];
        this.currentStatus = this.statusNames.indexOf(result['data'].status);
      })
    }


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

  getEmailError(){
    if(this.registerForm.controls.email.hasError('email')){
      return 'Enter the correct email address'
    }else{
      return ''
    }
  }

  // getContactError(){
  //   if(this.surgeryForm.controls.contact.value.length != 10){
  //     return 'Enter the correct contact number'
  //   }else{
  //     return ''
  //   }
  // }

  // doPatientFilter(value){
  //   let result =this.patientList.filter(option => 
  //     option.fname.toString().toLowerCase().includes(value.toLowerCase())
  //     || option.lname.toString().toLowerCase().includes(value.toLowerCase())
  //   );
  //   if(result == ""){
  //     result = [{fname: "Add " ,
  //      lname: value}];
  //   }
  //   return result
  // }

  checkContact(){
    var strValue = this.surgeryForm.controls.contact.value;
    if(strValue != null && strValue != ''){
      if(!strValue.includes("_")){
        this.patientService.getPatientByContact(strValue.split("-").join('')).subscribe((res)=>{
          this.showDetails = true;
          this.newUser = false;
          this.names = []
          this.patientDetails = res['data']
          console.log(res);
          for(var data of this.patientDetails){
            this.names.push(data.fname + " " + data.lname)
          }
          this.registerForm = this.fb.group({
            fname:["",Validators.required],
            lname:[{value: "", disabled: true},Validators.required],
            dob:[{value: "", disabled: true},Validators.required],
            // email:["",[Validators.required, Validators.email]],
          })
        }, (err)=>{
          if(err.error.status == "NOT_FOUND"){
            this.showDetails = false;
            this.newUser = false;
            Swal.fire({
              text: "The patient id is not present. Please create a new user",
              icon: "warning"
            })
          }
        })
      }else{
        this.showDetails = false;
        this.newUser = false;
      }
    }
  }

  addUser(){
    this.showDetails = true;
    this.newUser = true;
    this.registerForm = this.fb.group({
      fname:["",Validators.required],
      lname:["",Validators.required],
      dob:["",Validators.required],
      // email:["",[Validators.required, Validators.email]],
    })
  }

  getDetails(index){
    this.patientId = this.patientDetails[index].id;
    this.registerForm = this.fb.group({
      fname:[this.names[index],Validators.required],
      lname:[{value: this.patientDetails[index].lname, disabled: true},Validators.required],
      dob:[{value: new Date(this.patientDetails[index].dob), disabled: true},Validators.required],
      // email:["",[Validators.required, Validators.email]],
    })
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
    if(this.surgeryForm.invalid || this.registerForm.invalid){
      this.invalidForm = true 
      return false;
    }else{
      this.invalidForm = false
      if(!this.newUser){
        this.surgeryService.createSurgery({
          pt_id: this.patientId,
          type:this.surgeryForm.controls.type.value,
          date:this.surgeryForm.controls.date.value.toLocaleDateString('en-US'),
          time:this.surgeryForm.controls.time.value.toLocaleTimeString('en-US'),
          surgeon:this.surgeryForm.controls.surgeon.value,
          venue:this.surgeryForm.controls.venue.value,
          prescription:this.surgeryForm.controls.prescription.value,
          instructions:this.surgeryForm.controls.instructions.value,
          status: "Surgery Scheduled"
        }).subscribe((res)=>{
          Swal.fire({
            text: "Surgery created successfully",
            icon: "success"
          }).then(result =>{
            this.dialog.close()
          })
        },(err)=>{
          Swal.fire({
            text: "There was an error while creating the surgery",
            icon: "error"
          })
        })
      }else{
        this.patientService.registerPatient({
          fname: this.registerForm.controls.fname.value,
          lname: this.registerForm.controls.lname.value,
          dob: new Date(this.registerForm.controls.dob.value).toLocaleDateString("en-US"),
          contact: this.surgeryForm.controls.contact.value.split("-").join('')
        }).subscribe((result)=>{
          this.surgeryService.createSurgery({
            pt_id: result['id'],
            type:this.surgeryForm.controls.type.value,
            date:this.surgeryForm.controls.date.value.toLocaleDateString('en-US'),
            time:this.surgeryForm.controls.time.value.toLocaleTimeString('en-US'),
            surgeon:this.surgeryForm.controls.surgeon.value,
            venue:this.surgeryForm.controls.venue.value,
            prescription:this.surgeryForm.controls.prescription.value,
            instructions:this.surgeryForm.controls.instructions.value,
            status: "Surgery Scheduled"
          }).subscribe((res)=>{
            Swal.fire({
              text: "Surgery created successfully",
              icon: "success"
            }).then(result =>{
            this.dialog.close()
            })
          },(err)=>{
            Swal.fire({
              text: "There was an error while creating the surgery",
              icon: "error"
            })
          })
        },(err)=>{
          if(err.error.status == "BAD_REQUEST"){
            this.newUser = false;
            this.submitForm;
          }
          Swal.fire({
            text: "There was an error while creating the surgery",
            icon: "error"
          })
        })
      }
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
        prescription:this.surgeryForm.controls.prescription.value,
        instructions:this.surgeryForm.controls.instructions.value,
        status: this.receivedData.status
      }).subscribe((res)=>{
        Swal.fire({
          text: "Surgery updated successfully",
          icon: "success"
        }).then(result =>{
          this.dialog.close({
            response: {
              id:this.data.id,
              type:this.surgeryForm.controls.type.value,
              date:this.surgeryForm.controls.date.value.toLocaleDateString('en-US'),
              time:this.surgeryForm.controls.time.value.toLocaleTimeString('en-US'),
              surgeon:this.surgeryForm.controls.surgeon.value,
              venue:this.surgeryForm.controls.venue.value,
              prescription:this.surgeryForm.controls.prescription.value,
              instructions:this.surgeryForm.controls.instructions.value,
              status: this.receivedData.status
            } 
          })
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

  selectStatus(index){
    this.temp = this.currentStatus;
      if(index > this.currentStatus){
        this.showAlert = true;
        this.currentStatus = index
        this.selectedSatus = this.statusNames[index]
      }else{
        return false;
      }
  }

  async saveStatus(e){
    if(e == 'yes'){
      this.receivedData.id = this.data.id;
      this.receivedData.status = this.selectedSatus
      await this.surgeryService.updateStatus(this.receivedData,this.socket)
      Swal.fire({
        text: "Status changed successfully",
        icon: "success"
      }).then(result =>{
        this.dialog.close({
          response:{
            id: this.data.id,
            status: this.selectedSatus
          }
        })
      })
  }else{
    this.showAlert = false;
    this.currentStatus = this.temp;
    this.selectedSatus = this.statusNames[this.currentStatus]
  }
  }

  closeDialog(){
    this.dialog.close();
    this.showAlert = false;
  }

}
