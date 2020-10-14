import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/Authentication.service';
import { UserService } from 'src/services/User.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  registerForm: FormGroup;

  invalidForm:Boolean = false;

  roles: any = [
    {value: 'Admin'},
    {value: 'Pre-op Co-ordinator'},
    {value: 'Patient'}
  ];

  today = new Date();
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthService
  ) { }

  ngOnInit(): void {

    var url = this.router.url;

    this.registerForm = this.fb.group({
      fname:["",Validators.required],
      lname:["",Validators.required],
      dob:["",Validators.required],
      email:["",[Validators.required, Validators.email]],
      contact:["",[Validators.required, Validators.min(1000000000), Validators.max(9999999999)]],
      role:["",Validators.required]
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
    if(this.registerForm.controls.email.hasError('email')){
      return 'Enter the correct email address'
    }else{
      return ''
    }
  }

  getContactError(){
    if(this.registerForm.controls.contact.value.length != 10){
      return 'Enter the correct contact number'
    }else{
      return ''
    }
  }

  submitForm(){
    if(this.registerForm.invalid){
      this.invalidForm = true;
    }else{
      this.invalidForm = false;
      this.userService.registerUser(this.registerForm.value).subscribe((res)=>{
        Swal.fire({
          text: "The user has been created successfully and a mail regarding the login credentials has been sent to the user.",
          icon: "success"
        }).then(res=>{
          if(res.value){
            location.reload();
          }
        })
      },(err)=>{
        if(err.error.status == 'BAD_REQUEST'){
          Swal.fire({
            text: "The user already exits.",
            icon: "error"
          })
        }else{
          Swal.fire({
            text: "There was problem while registering the user. Please try again after few minutes.",
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
