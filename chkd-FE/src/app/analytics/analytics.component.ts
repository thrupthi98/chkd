import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexLegend, ApexMarkers, ApexStroke, ApexTitleSubtitle, ApexXAxis, ApexYAxis, NgApexchartsModule } from 'ng-apexcharts';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AnalyticsService } from 'src/services/Analytics.service';
import { AuthService } from 'src/services/Authentication.service';
import { SurgeryTypeService } from 'src/services/SurgeryType.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  public chartOptions: Partial<ChartOptions>;

  typeList: any = [];
  graphList: any = [];
  showList: any = [];
  filteredSurgerykywds: Observable<string[]>;
  surgery = new FormControl();

  average:Boolean;
  maximum:Boolean;
  minimum:Boolean;

  constructor(
    private analyticsService: AnalyticsService,
    private surgeryTypeservice: SurgeryTypeService,
    private authenticationService : AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
   
    this.updateChartOptions();

    this.activate('average')

    var url = this.router.url;
    
    this.authenticationService.checkAccess(url).subscribe((res)=>{
      this.surgeryTypeservice.getAllSurgeryTypes().subscribe((res)=>{
        for(let data of res['data']){
          this.typeList.push(data.type)
        }
        this.filteredSurgerykywds = this.surgery.valueChanges.pipe(startWith(''), map(value => 
          this.surgeryFilter(value)
        ));
      },(err)=>{
        console.log("type-error")
      })
    },(err)=>{
      if(err.error != undefined && err.error.status == "UN_AUTHORISED"){
        this.router.navigateByUrl("/no-access")
      }else{
        this.router.navigateByUrl("/")
      }
    })
  }

  surgeryFilter(value: string): string[]{
    let result =this.typeList.filter(option => 
      option.toString().toLowerCase().includes(value.toLowerCase())
    );
    return result
  }

  activate(e){
    this.graphList = [];
    this.average = false;
    this.maximum = false;
    this.minimum = false;
    switch(e){
      case 'average': 
      this.average = true; 
      this.showList.forEach(element => {
        this.analyticsService.getAverageTime(element).subscribe((res)=>{
          this.graphList.push({
            name: element,
            data: [res['data'][0].avg_checkin.toFixed(2), res['data'][0].avg_Insurgery.toFixed(2), res['data'][0].avg_postSurgery.toFixed(2), res['data'][0].avg_discharged.toFixed(2)]
          })
          this.updateChartOptions();
          this.chartOptions.series = this.graphList;
        });
      })
      break;
      case 'maximum': 
      this.maximum = true; 
      this.showList.forEach(element => {
        this.analyticsService.getMaxTime(element).subscribe((res)=>{
          this.graphList.push({
            name: element,
            data: [res['data'][0].max_checkin.toFixed(2), res['data'][0].max_Insurgery.toFixed(2), res['data'][0].max_postSurgery.toFixed(2), res['data'][0].max_discharged.toFixed(2)]
          })
          this.updateChartOptions();
          this.chartOptions.series = this.graphList;
        });
      })
      break;
      case 'minimum': 
      this.minimum = true; 
      this.showList.forEach(element => {
        this.analyticsService.getMinTime(element).subscribe((res)=>{
          this.graphList.push({
            name: element,
            data: [res['data'][0].min_checkin.toFixed(2), res['data'][0].min_Insurgery.toFixed(2), res['data'][0].min_postSurgery.toFixed(2), res['data'][0].min_discharged.toFixed(2)]
          })
          this.updateChartOptions();
          this.chartOptions.series = this.graphList;
        });
      })
      break;
    }
  }

  getGraph(opt){
    if(this.average){
    this.analyticsService.getAverageTime(opt).subscribe((res)=>{
      this.showList.push(opt)
      this.typeList.splice(this.typeList.indexOf(opt),1)
      this.graphList.push({
        name: opt,
        data: [res['data'][0].avg_checkin.toFixed(2), res['data'][0].avg_Insurgery.toFixed(2), res['data'][0].avg_postSurgery.toFixed(2), res['data'][0].avg_discharged.toFixed(2)]
      })
      this.updateChartOptions();
      this.chartOptions.series = this.graphList;
    })
  }else if(this.maximum){
    this.analyticsService.getMaxTime(opt).subscribe((res)=>{
      this.showList.push(opt)
      this.typeList.splice(this.typeList.indexOf(opt),1)
      this.graphList.push({
        name: opt,
        data: [res['data'][0].max_checkin.toFixed(2), res['data'][0].max_Insurgery.toFixed(2), res['data'][0].max_postSurgery.toFixed(2), res['data'][0].max_discharged.toFixed(2)]
      })
      this.updateChartOptions();
      this.chartOptions.series = this.graphList;
    })
    }else if(this.minimum){
      this.analyticsService.getMinTime(opt).subscribe((res)=>{
        this.showList.push(opt)
        this.typeList.splice(this.typeList.indexOf(opt),1)
        this.graphList.push({
          name: opt,
          data: [res['data'][0].min_checkin.toFixed(2), res['data'][0].min_Insurgery.toFixed(2), res['data'][0].min_postSurgery.toFixed(2), res['data'][0].min_discharged.toFixed(2)]
        })
        this.updateChartOptions();
        this.chartOptions.series = this.graphList;
      })
    }
  }

  remove(item){
    this.typeList.push(item)
    this.showList.splice(this.showList.indexOf(item),1)
    for(var index in this.graphList){
      if(this.graphList[index].name == item){
        this.graphList.splice(index,1)
      }
    }
    this.updateChartOptions();
    this.chartOptions.series = this.graphList;
  }

  updateChartOptions(){
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: ["#7f0000","#00ff00","#0000ff","#00007f","#7fff0f"],
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "Average time taken for each process in surgery",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      markers: {
        size: 1
      },
      xaxis: {
        categories: ["Patient Checkin", "Patient In surgery", "Patient post surgery", "Patient discharged"],
        title: {
          text: "Process Names"
        }
      },
      yaxis: {
        title: {
          text: "Time Taken (in minutes)"
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };
  }
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};
