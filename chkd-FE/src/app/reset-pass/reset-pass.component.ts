import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/Authentication.service';
import { LoginService } from 'src/services/Login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {

  resetForm: FormGroup;
  hide:Boolean = true;
  hideNew: Boolean = true;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private route: Router,
    private authenticationService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    var url = this.route.url;
    
    this.resetForm = this.fb.group({
      current: ["", Validators.required],
      new: ["",[Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$")]],
      repeat: ["", Validators.required]
    })

    this.authenticationService.checkAccess(url).subscribe((res)=>{
      console.log("success")
    },(err)=>{
      if(err.error != undefined && err.error.status == "UN_AUTHORISED"){
        this.route.navigateByUrl("/no-access")
      }
    })
  }

  getCurrentError(){
      if(this.resetForm.controls.current.hasError('required')){
        return 'Required'
      }else{
        return ''
      }
  }
  getNewError(){
    if(this.resetForm.controls.new.hasError('required')){
      return 'Required'
    }else if(this.resetForm.controls.new.hasError('pattern')){
      return 'Password too weak'
    }else{
      return ''
    }
  }
  getRepError(){
    if(this.resetForm.controls.repeat.hasError('required')){
      return 'Required'
    }else{
      return ''
    }
  }

  closeDialog(){
    this.dialog.closeAll()
  }

  submit(){
    this.loginService.resetPassword({
      current:this.resetForm.controls.current.value,
      new:this.resetForm.controls.new.value,
    }).subscribe((res)=>{
          Swal.fire({
            text: "Password changed successfully",
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.value) {
              location.reload()
            } else{
              // console.log("error")
            }
          })
    },(err)=>{
      switch(err.error.status){
      case "UNAUTHORISED": 
        this.route.navigateByUrl("/no-access")
      break;
      case "SAME_PASS":
          Swal.fire({
            text: "The new password is too similiar to the old password",
            icon: 'error',
            confirmButtonText: 'OK',
          })
      break;
      case "NOT_FOUND":
        Swal.fire({
          title:"Password Not Found",
          text: "There is no password that matches the current password",
          icon: 'error',
          confirmButtonText: 'OK',
        })
      break;
      case "BAD_REQUEST":
        Swal.fire({
          title:"Error",
          text: "There was some issue in reseting the password",
          icon: 'error',
          confirmButtonText: 'OK',
        })
      break;
    }
    })
  }

}
