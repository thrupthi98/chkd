import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexLegend, ApexMarkers, ApexStroke, ApexTitleSubtitle, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AnalyticsService } from 'src/services/Analytics.service';
import { SurgeryTypeService } from 'src/services/SurgeryType.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  public chartOptions: Partial<ChartOptions>;

  typeList: any = [];
  filteredSurgerykywds: Observable<string[]>;
  surgery = new FormControl();

  constructor(
    private analyticsService: AnalyticsService,
    private surgeryTypeservice: SurgeryTypeService,
  ) { }

  ngOnInit(): void {
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
      colors: ["#77B6EA", "#545454"],
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
        },
        min: 5,
        max: 40
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };

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
  }

  surgeryFilter(value: string): string[]{
    let result =this.typeList.filter(option => 
      option.toString().toLowerCase().includes(value.toLowerCase())
    );
    return result
  }

  getGraph(opt){
    this.analyticsService.getAverageTime(opt).subscribe((res)=>{
      console.log(res['data'])
    })
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
