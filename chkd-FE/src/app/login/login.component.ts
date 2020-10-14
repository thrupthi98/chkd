import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/services/Login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:["",[Validators.required, Validators.email]],
      password:["",[Validators.required]]
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

  login(){
    if(this.loginForm.invalid){
      return false;
    }else{
      this.loginService.loginAdmin(this.loginForm.value).subscribe((res)=>{
        localStorage.setItem("UUID",res['UUID']);
        switch(res['role']){
          case "Admin": this.router.navigateByUrl('/admin')
          break;
          case "Pre-op Co-ordinator": this.router.navigateByUrl('/pre-op')
          break;
          default: this.router.navigateByUrl('/patient')
        }
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

}
