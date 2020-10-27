import { Component, OnInit } from '@angular/core';
import io from "socket.io-client";
import { isDataSource } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { SurgeryService } from 'src/services/Surgery.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  private url = 'http://localhost:3000';
  private socket;

  patientDetails: any = [];
  patient;

  statusNames = ['Surgery Scheduled','Patient Checked in','Patient In Surgery', 'Post Surgery', 'Patient Discharged'];
  statusIcons = ['alarm_on','weekend','airline_seat_flat','accessible','check_circle'];
  currentStatus: any = [];
  surgeryIds: any = [];

  constructor(
    private surgeryService: SurgeryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.socket = io.connect(this.url);

    this.surgeryService.getPatientSurgery().subscribe((res)=>{
      this.patientDetails = res['data']
      
      for(var data of this.patientDetails){
        this.currentStatus.push(this.statusNames.indexOf(data.status))
        this.surgeryIds.push(data.id)
      }

      this.patient = this.patientDetails[0].patient;

      this.socket.on(this.patientDetails[0].pt_id, (data) => {
        this.currentStatus[this.surgeryIds.indexOf(data['data']['id'])] = this.statusNames.indexOf(data['data']['status'])
      });

      this.patientDetails.forEach(item => {
        item.date = new Date(item.dateTime).toLocaleDateString("en-US")
        item.time = new Date(item.dateTime).toLocaleTimeString("en-US")
      });

    }, (err)=>{
      this.router.navigateByUrl("/")
    })
  }

}
