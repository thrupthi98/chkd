import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/Authentication.service';
import { SurgeonService } from 'src/services/Surgeon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-surgeons',
  templateUrl: './surgeons.component.html',
  styleUrls: ['./surgeons.component.css']
})
export class SurgeonsComponent implements OnInit {

  surgeonForm: FormGroup;

  invalidForm:Boolean = false;

  roles: any = [
    {value: 'Admin'},
    {value: 'Pre-op Co-ordinator'},
    {value: 'Patient'}
  ];

  today = new Date();
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthService,
    private surgeonService: SurgeonService
  ) { }

  ngOnInit(): void {

    var url = this.router.url;

    this.surgeonForm = this.fb.group({
      fname:["",Validators.required],
      lname:["",Validators.required],
      email:["",[Validators.required, Validators.email]],
      contact:["",[Validators.required, Validators.min(1000000000), Validators.max(9999999999)]],
    })
    
    this.authenticationService.checkAccess(url).subscribe((res)=>{
      console.log("success")
    },(err)=>{
      if(err.error != undefined && err.error.status == "UN_AUTHORISED"){
        this.router.navigateByUrl("/no-access")
      }else{
        this.router.navigateByUrl("/")
      }
    })
  }

  getEmailError(){
    if(this.surgeonForm.controls.email.hasError('email')){
      return 'Enter the correct email address'
    }else{
      return ''
    }
  }

  getContactError(){
    if(this.surgeonForm.controls.contact.value.length != 10){
      return 'Enter the correct contact number'
    }else{
      return ''
    }
  }

  submitForm(){
    if(this.surgeonForm.invalid){
      this.invalidForm = true;
    }else{
      this.invalidForm = false;
      this.surgeonService.createSurgeon(this.surgeonForm.value).subscribe((res)=>{
        Swal.fire({
          text: "Surgeon has been created successfully.",
          icon: "success"
        }).then(res=>{
          if(res.value){
            location.reload();
          }
        })
      },(err)=>{
        if(err.error.status == 'BAD_REQUEST'){
          Swal.fire({
            text: "The surgeon already exits.",
            icon: "error"
          })
        }else{
          Swal.fire({
            text: "There was problem while registering the surgeon. Please try again after few minutes.",
            icon: "error"
          }).then(res=>{
            if(res.value){
              location.reload();
            }
          })
        }
      })
    }
  } 
}
