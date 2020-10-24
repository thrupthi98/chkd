import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/User.service';
import io from "socket.io-client";

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

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.socket = io.connect(this.url);

    this.userService.getPatientDetails().subscribe((res)=>{
      this.patientDetails = res['data']
      this.patient = this.patientDetails[0].patient;

      this.patientDetails.forEach(item => {
        item.date = new Date(item.dateTime).toLocaleDateString("en-US")
        item.time = new Date(item.dateTime).toLocaleTimeString("en-US")
      });

      for(var data of this.patientDetails){
        this.currentStatus.push(this.statusNames.indexOf(data.status))
      }
    })

    this.socket.on('updateStatus', (data) => {
      this.currentStatus[0] = this.statusNames.indexOf(data['data']['status'])
    });
  }

}
