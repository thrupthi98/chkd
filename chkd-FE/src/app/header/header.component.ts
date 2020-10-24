import { Component, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { DataService } from 'src/services/Data.service';
import { ResetPassComponent } from '../reset-pass/reset-pass.component';
import { LoginService } from 'src/services/Login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  role = "none";

  isHandset: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    isTablet: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Tablet)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    isMedium: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Medium)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private dialog: MatDialog,
    private loginService : LoginService
  ){
    this.router.events.subscribe((evt) => {
      if(evt instanceof NavigationEnd){
        return;
      }
      window.scroll(0, 0);
    })
  }

  ngOnInit(): void{
    this.router.events.subscribe((evt) => {
      if(evt instanceof NavigationEnd){
        if(evt.url == "/"){
          this.role = "none"
          this.activate("home");
        }
        if(evt.url == "/admin"){
          this.role = "admin"
        }
        if(evt.url == "/pre-op"){
          this.role = "pre-op"
        }
        if(evt.url == "/patient"){
          this.role = "patient"
        }
      }
    })    
  }

    activate(e){
      try{
        (<HTMLInputElement>document.getElementById("home")).style.backgroundColor = "none";
        (<HTMLInputElement>document.getElementById(e)).style.backgroundColor = "#face70";
      }catch(error){
        
      }
    }

    openLogin(){
      let dialogRef = this.dialog.open(LoginComponent, {
        disableClose: true
      });
      
      dialogRef.afterClosed().subscribe((result) => {
        if(result != undefined){
          switch(result.role){
            case "Admin": 
            this.role = "admin";
            this.router.navigateByUrl("/admin")
            break;
            case "Pre-op Co-ordinator": 
            this.role = "pre-op"
            this.router.navigateByUrl("/pre-op")
            break;
            case "Patient":
            this.role = "patient"
            this.router.navigateByUrl("/patient")
            break;
          }
        }
      })
    }

    resetDialog(){
      this.dialog.open(ResetPassComponent,{disableClose: true, panelClass:'reset-wrap'})
    }


  logout(){
    this.loginService.logoutAdmin(localStorage.getItem("UUID")).subscribe((res)=>{
      localStorage.removeItem("UUID")
      this.router.navigateByUrl("/")
    },(err)=>{
      Swal.fire({
        text: "There was a problem during logout",
        icon:"error"
      })
    })
  }
}
