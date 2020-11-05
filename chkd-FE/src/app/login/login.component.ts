import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/services/Login.service';
import { PatientService } from 'src/services/Patient.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  patientForm: FormGroup;
  selectedIndex = 0;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private patientService: PatientService,
    private router: Router,
    private dialog: MatDialogRef<LoginComponent>
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:["",[Validators.required, Validators.email]],
      password:["",[Validators.required]]
    })

    this.patientForm = this.fb.group({
      id: ["",[Validators.required]]
    })
  }

  getEmailError(){
    if(this.loginForm.controls.email.hasError('required')){
      return 'Required'
    }else if(this.loginForm.controls.email.hasError('email')){
      return 'Enter the correct email address'
    }else{
      return ''
    }
  }

  getPasswordError(){
    if(this.loginForm.controls.password.hasError('required')){
      return 'Required'
    }else{
      return ''
    }
  }

  nextStep(user){
    if(user == 'admin'){
      this.selectedIndex ++;
    }else{
      this.selectedIndex += 2;
    }
  }

  prevStep(user){
    if(user == 'admin'){
      this.selectedIndex --;
    }else{
      this.selectedIndex -= 2;
    }
  }

  login(){
    if(this.loginForm.invalid){
      return false;
    }else{
      console.log(this.loginForm.value);
      this.loginService.loginAdmin(this.loginForm.value).subscribe((res)=>{
<<<<<<< HEAD
        localStorage.setItem("UUID",res['UUID']);
        console.log(res);
=======
        sessionStorage.setItem("UUID",res['UUID']);
>>>>>>> e0ecf151c912b6730cac711183c29119e7f45e60
        this.dialog.close({
          loggedIn: true,
          role: res['returnUrl']
        })
      }, (err)=>{
        if(err.error.status == "BAD_REQUEST"){
          Swal.fire({
            title:"Wrong Credentials",
            text:"The email/password doesnt exist. Please enter correct credentials in order to login",
            icon:"error"
          })
        }else{
          Swal.fire({
            text:"There was a problem during login. Please try again after few minutes",
            icon:"error"
          })
        }
      })
    }
  }

  loginPatient(){
    if(this.patientForm.invalid){
      return false;
    }else{
      this.patientService.loginPatient({
        id: this.patientForm.controls.id.value
      }).subscribe((res)=>{
        localStorage.setItem("token",res['token'])
        sessionStorage.setItem("UUID",res['UUID']);
        this.dialog.close({
          loggedIn: true,
          role: res['returnUrl']
        })
      }, (err)=>{
        if(err.error.status == "NOT_FOUND"){
          Swal.fire({
            title:"Wrong Credentials",
            text:"The patient ID doesnt exist. Please enter correct credentials in order to login",
            icon:"error"
          })
        }else{
          Swal.fire({
            text:"There was a problem during login. Please try again after few minutes",
            icon:"error"
          })
        }
      })
    }
  }

  closeDialog(){
    this.dialog.close({
      loggedIn: false,
      role: "none"
    })
  }

}
