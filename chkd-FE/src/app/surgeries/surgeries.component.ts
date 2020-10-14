import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/Authentication.service';
import { SurgeryTypeService } from 'src/services/SurgeryType.service';

@Component({
  selector: 'app-surgeries',
  templateUrl: './surgeries.component.html',
  styleUrls: ['./surgeries.component.css']
})
export class SurgeriesComponent implements OnInit {

  surgeryForm: FormGroup;

  viewList:any = [];

  prepIndex;

  prep:Boolean = true;
  
  prepList:any = [];
  visitList:any = [];
  homeCareList:any = [];
  concernList: any = [];

  constructor(
    private fb: FormBuilder,
    private surgeryTypeService: SurgeryTypeService,
    private router: Router,
    private authenticationService: AuthService
  ) { }

  ngOnInit(): void {

    var url = this.router.url;

    this.surgeryForm = this.fb.group({
      type:["", [Validators.required]],
      description:["", [Validators.required]],
      prep: this.fb.array([]),
      visit: this.fb.array([]),
      homeCare: this.fb.array([]),
      concern: this.fb.array([]),
      followUp: ["", [Validators.required]],
      videos: this.fb.array([])
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

  initialiseForm(){
    return this.fb.group({
      question:["", Validators.required],
      answer:["", Validators.required]
    })
  }

  videoForm(){
    return this.fb.group({
      name:[""],
      link:[""]
    })
  }

  get getPrepControls() {
    const control = this.surgeryForm.get("prep") as FormArray;
    return control;
  }

  get getVisitControls(){
    const control = this.surgeryForm.get("visit") as FormArray;
    return control;
  }

  get getHomeCareControls(){
    const control = this.surgeryForm.get("homeCare") as FormArray;
    return control;
  }

  get getConcernControls(){
    const control = this.surgeryForm.get("concern") as FormArray;
    return control;
  }

  get getVideoControls(){
    const control = this.surgeryForm.get("videos") as FormArray;
    return control;
  }

  addPrep(){
    this.prep = false;
    const control = this.surgeryForm.get("prep") as FormArray;
    // if(control.value.length != 0){
    //   if(control.value[control.value.length-1].question == "" || control.value[control.value.length-1].answer == ""){
    //     return false;
    //   }
    // }
    control.push(this.initialiseForm());
    this.viewList[0] = control.controls[control.controls.length -1]
    this.prepIndex = control.controls.length -1;
    console.log(this.prepIndex)
  }

  addVisit(){
    const control = this.surgeryForm.get("visit") as FormArray;
    if(control.value.length != 0){
      if(control.value[control.value.length-1].question == "" || control.value[control.value.length-1].answer == ""){
        return false;
      }
    }
    control.push(this.initialiseForm());
  }

  addHomeCare(){
    const control = this.surgeryForm.get("homeCare") as FormArray;
    if(control.value.length != 0){
      if(control.value[control.value.length-1].question == "" || control.value[control.value.length-1].answer == ""){
        return false;
      }
    }
    control.push(this.initialiseForm());
  }

  addConcern(){
    const control = this.surgeryForm.get("concern") as FormArray;
    if(control.value.length != 0){
      if(control.value[control.value.length-1].question == "" || control.value[control.value.length-1].answer == ""){
        return false;
      }
    }
    control.push(this.initialiseForm());
  }

  addVideos(){
    const control = this.surgeryForm.get("videos") as FormArray;
    if(control.value.length != 0){
      if(control.value[control.value.length-1].question == "" || control.value[control.value.length-1].answer == ""){
        return false;
      }
    }
    control.push(this.videoForm());
  }

  addToSidePrep(){
    this.prep = true;
    const control = this.surgeryForm.get("prep") as FormArray;
    this.prepList.push(control.value[control.value.length-1].question)
  }

  view(index){
    this.prep = true;
    const control = this.surgeryForm.get("prep") as FormArray;
    this.viewList[0] = control.controls[index];
    this.prepIndex = index;
  }

  submitForm(){
    if(this.surgeryForm.invalid){
      return false
    }else{
      console.log(this.surgeryForm.value)
      this.surgeryTypeService.createSurgeryType(this.surgeryForm.value).subscribe((res)=>{
        console.log("success")
      },(err)=>{
        console.log("err")
      })
    }
  }

}
