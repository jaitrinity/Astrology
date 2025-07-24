import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/service/SharedService';
declare var $: any;

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  mobile:any="";
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  inProgress : boolean = false;
  loaderGif: any = "assets/img/loader.gif";
  defaultImg: any = "assets/img/default.jpg";
  yearList: any = [];
  monthList = [
    { number: 1, name: 'January' },
    { number: 2, name: 'February' },
    { number: 3, name: 'March' },
    { number: 4, name: 'April' },
    { number: 5, name: 'May' },
    { number: 6, name: 'June' },
    { number: 7, name: 'July' },
    { number: 8, name: 'August' },
    { number: 9, name: 'September' },
    { number: 10, name: 'October' },
    { number: 11, name: 'November' },
    { number: 12, name: 'December' },
  ];
  dateList : any = [];
  hoursList: any = [];
  minutesList: any = [];
  secondsList: any = [];
  locationResult: any = [];
  showModal = false;
  year: number=2000;
  month: number=12;
  date: number=20;
  hours: number=0;
  minutes: number=0;
  seconds: number=0;
  locationList: any = [];
  location: string="";
  selectedLocation: string="";
  latitude: number;
  longitude: number;
  myLatitude: number;
  myLongitude: number;
  timezone: number;
  myTimezone: number;
  planetResult: any;
  planetOutput: any;
  planetExtendedOutput: any;
  planetExtendedList: any = [];
  // horoscopeChartSvg: any = this.defaultImg;
  horoscopeChart: any = this.defaultImg;
  navamsaChart: any = this.defaultImg;
  chartType: string = "north_india";
  mahaDasas: any;
  antarDashaList: any;
  mahaAntaDasasOutput: any;
  d2ChartUrl: any = this.defaultImg;  
  d3ChartUrl: any = this.defaultImg;  
  d4ChartUrl: any = this.defaultImg;  
  d5ChartUrl: any = this.defaultImg;  
  d6ChartUrl: any = this.defaultImg;  
  d7ChartUrl: any = this.defaultImg;  
  d8ChartUrl: any = this.defaultImg;  
  d10ChartUrl: any = this.defaultImg;  
  d11ChartUrl: any = this.defaultImg;  
  d12ChartUrl: any = this.defaultImg;  
  d16ChartUrl: any = this.defaultImg;  
  d20ChartUrl: any = this.defaultImg;  
  d24ChartUrl: any = this.defaultImg;  
  d27ChartUrl: any = this.defaultImg;  
  d30ChartUrl: any = this.defaultImg;  
  d40ChartUrl: any = this.defaultImg;  
  d45ChartUrl: any = this.defaultImg;  
  d60ChartUrl: any = this.defaultImg;  
  modalTitle: any;  
  isModalData: boolean = false;
  constructor(private sharedService : SharedService, private sanitizer: DomSanitizer, 
    private datePipe: DatePipe, private _snackBar: MatSnackBar) {
      this.mobile = localStorage.getItem("mobile");
    }

  ngOnInit(): void {
    let d = new Date();
    this.year = d.getFullYear();
    for(let i=this.year;i>1950;i--){
      this.yearList.push(i)
    }
    for(let i=1;i<=31;i++){
      this.dateList.push(i)
    }
    for(let i=0;i<24;i++){
      this.hoursList.push(i)
    }
    for(let i=0;i<60;i++){
      this.minutesList.push(i)
      this.secondsList.push(i)
    }

    this.month = d.getMonth()+1;
    this.date = d.getDate();

    this.hours = parseInt(this.datePipe.transform(d, 'HH'));
    this.minutes = parseInt(this.datePipe.transform(d, 'mm'));
    this.seconds = parseInt(this.datePipe.transform(d, 'ss'));
    this.timezone = -(d.getTimezoneOffset())/60;
    this.myTimezone = this.timezone;

    this.getCurrentLocation();
    this.getAllLocation();
  }

  openSnackBar(message:any) {
    this._snackBar.open(message, '', {
      duration: 2000,
      panelClass: ['snackbar-bg'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  getCurrentLocation(): void {
    let errorMessage;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.myLatitude = this.latitude;
          this.myLongitude = this.longitude;
          errorMessage = undefined; // Clear any previous error
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'User denied the request for Geolocation.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'The request to get user location timed out.';
              break;
            default:
              errorMessage = 'An unknown error occurred.';
              break;
          }
          this.openSnackBar(errorMessage);
        }
      );
    } else {
      errorMessage = 'Geolocation is not supported by this browser.';
      this.openSnackBar(errorMessage);
    }
  }

  getAllLocation(){
    let jsonData = {
      searchType: 'location'
    }
    this.sharedService.getAnyData(jsonData)
    .subscribe(
      (results)=>{
        this.locationList = results;
      },
      (error)=>{
        this.openSnackBar(error.error.message);
      }
    )
  }

  closeModal() {
    this.showModal = false;
  }

  getLocation(){
    this.locationResult = [];
    this.selectedLocation = "";
    if(this.location == ""){
      this.latitude = this.myLatitude;
      this.longitude = this.myLongitude;
      this.timezone = this.myTimezone;
      return;
    }
    this.inProgress = true;
    let jsonData = {
      location: this.location
    }
    this.sharedService.getAllAstroApiData(jsonData, "geo-details")
    .subscribe(
      (results)=>{
        let error = results.error;
        if(error != null){
          this.openSnackBar(error[0]);
        }
        else{
          this.locationResult = results;
        }
        this.inProgress = false;
      },
      (error)=>{
        this.inProgress = false;
        this.openSnackBar(error.error.message);
      }
    )
  }

  changeLocation(event:any){
    let value = event.value;
    if(value == ""){
      this.latitude = this.myLatitude;
      this.longitude = this.myLongitude;
      this.timezone = this.myTimezone;
      return;
    }
    let valueSplit = value.split(" -- ");
    this.latitude = valueSplit[0];
    this.longitude = valueSplit[1];
    this.timezone = valueSplit[2];
    // alert(event.value)
  }

  submitDetails(){
    let jsonData = {
      insertType: 'user',
      mobile: this.mobile,
      year: Number(this.year),
      month: Number(this.month),
      date: Number(this.date),
      hours: Number(this.hours),
      minutes: Number(this.minutes),
      seconds: Number(this.seconds),
      latitude: Number(this.latitude),
      longitude: Number(this.longitude),
      timezone: Number(this.timezone),
    }
    this.sharedService.insertAnyData(jsonData)
    .subscribe(
      (results)=>{
        if(results.code == 200){
          // alert(results.message);
        }
        else{

        }
        // this.openSnackBar(results.message);
      },
      (error)=>{
        this.openSnackBar(error.error.message);
      }
    )
  }
  activeMatLabIndex: any = 0;
  submit(){
    this.submitDetails();
    this.getPlanetAndExtended();
    this.getMahaAntardasas();
    if(this.activeMatLabIndex == 2){
      this.getAllCharts();
    }
    
  }

  onTabChange(event: MatTabChangeEvent):void{
    let index = event.index;
    this.activeMatLabIndex = index;
    // let txtLabel = event.tab.textLabel;
    // alert(txtLabel);
    if(index == 0){
      // Planet
    }
    else if(index == 1){
      // Maha Dasas
    }
    if(index == 2){
      // Charts
      this.getAllCharts();
    }
  }

  getPlanetAndExtended(){
    this.getPlanets();
    this.getPlanetsExtended();
  }

  getPlanets(){
    this.planetOutput = [];
    let jsonData = {
      "year": Number(this.year),
      "month": Number(this.month),
      "date": Number(this.date),
      "hours": Number(this.hours),
      "minutes": Number(this.minutes),
      "seconds": Number(this.seconds),
      "latitude": Number(this.latitude),
      "longitude": Number(this.longitude),
      "timezone": Number(this.timezone),
      "config": {
          "observation_point": "topocentric", /* topocentric / geocentric */
          "ayanamsha": "lahiri" /* lahiri / sayana */
      }
    }
    this.sharedService.getAllAstroApiData(jsonData, "planets")
    .subscribe(
      (results)=>{
        this.planetResult = results;
        const rawPlanets = this.planetResult.output[0];
        this.planetOutput = Object.keys(rawPlanets)
        .filter(key => !isNaN(Number(key)) && rawPlanets[key].fullDegree != null) // exclude "ayanamsa" and "debug"
        .map(key => {
          const p = rawPlanets[key];
          return {
            name: p.name,
            fullDegree: p.fullDegree,
            normDegree: p.normDegree,
            isRetro: p.isRetro,
            current_sign: p.current_sign,
          };
        });
      },
      (error)=>{
        this.openSnackBar(error.error.message);
      }
    )
  }

  toDMS(deg:number):any{
    const d = Math.floor(deg);
    const minFloat = (deg - d) * 60;
    const m = Math.floor(minFloat);
    const s = ((minFloat - m) * 60).toFixed(0);
    return `${d}° ${m}' ${s}"`;
  }

  getPlanetsExtended(){
    let jsonData = {
      "year": Number(this.year),
      "month": Number(this.month),
      "date": Number(this.date),
      "hours": Number(this.hours),
      "minutes": Number(this.minutes),
      "seconds": Number(this.seconds),
      "latitude": Number(this.latitude),
      "longitude": Number(this.longitude),
      "timezone": Number(this.timezone),
      "config": {
          "observation_point": "topocentric", /*  topocentric / geocentric */
          "ayanamsha": "lahiri", /* lahiri / sayana */
          "language":"en" /* te / en */
      }
    }

    this.sharedService.getAllAstroApiData(jsonData, "planets/extended")
    .subscribe(
      (results)=>{
        this.planetExtendedOutput = results.output;
      },
      (error)=>{
        this.openSnackBar(error.error.message);
      }
    )
  }

  showPlanetsExtended(planetName: any){
    this.planetExtendedList = [];
    const planetExtended = this.planetExtendedOutput[planetName];
    Object.entries(planetExtended).forEach(([key, value]) => {
      let jsonObj = {
        key: key,
        value: value
      }
      this.planetExtendedList.push(jsonObj);
    });
    this.isModalData = true; 
    this.modalTitle = planetName;
    this.showModal = true;
  }

  getMahaAntardasas(){
    this.getMahadasas();
    this.getMahaAntadasas();
  }

  getMahadasas(){
    this.mahaDasas = [];
    let jsonData = {
      "year": Number(this.year),
      "month": Number(this.month),
      "date": Number(this.date),
      "hours": Number(this.hours),
      "minutes": Number(this.minutes),
      "seconds": Number(this.seconds),
      "latitude": Number(this.latitude),
      "longitude": Number(this.longitude),
      "timezone": Number(this.timezone),
      "config": {
          "observation_point": "geocentric", /* geocentric / topocentric */
          "ayanamsha": "sayana" /* lahiri / sayana */
      }
    }

    this.sharedService.getAllAstroApiData(jsonData, "vimsottari/maha-dasas")
    .subscribe(
      (results)=>{
        const resultData = results;
        const mahaDasasOutput = JSON.parse(resultData.output);
        this.mahaDasas = Object.keys(mahaDasasOutput)
        .filter(key => !isNaN(Number(key))) 
        .map(key => {
          const p = mahaDasasOutput[key];
          return {
            lord: p.Lord,
            start_time: p.start_time,
            end_time: p.end_time
          };
        });
      },
      (error)=>{
        this.openSnackBar(error.error.message);
      }
    )
  }

  getMahaAntadasas(){
    let jsonData = {
      "year": Number(this.year),
      "month": Number(this.month),
      "date": Number(this.date),
      "hours": Number(this.hours),
      "minutes": Number(this.minutes),
      "seconds": Number(this.seconds),
      "latitude": Number(this.latitude),
      "longitude": Number(this.longitude),
      "timezone": Number(this.timezone),
      "config": {
          "observation_point": "geocentric", /* geocentric / topocentric */
          "ayanamsha": "sayana" /* lahiri / sayana */
      }
    }

    this.sharedService.getAllAstroApiData(jsonData, "vimsottari/maha-dasas-and-antar-dasas")
    .subscribe(
      (results)=>{
        const resultData = results;
        this.mahaAntaDasasOutput = JSON.parse(resultData.output);
      },
      (error)=>{
        this.openSnackBar(error.error.message);
      }
    )
  }

  showAntarDasas(lordName: any){
    const andarDasas = this.mahaAntaDasasOutput[lordName];
    this.antarDashaList = Object.entries(andarDasas).map(([name, period]: any) => ({
      name: lordName+" - "+name,
      start: period.start_time,
      end: period.end_time
    }));

    this.isModalData = false;
    this.modalTitle = lordName
    this.showModal = true;
  }

  setLoaderImg(apiName:any){
    let chartOutput = this.loaderGif;
    switch(apiName){
      // case 'horoscope-chart-svg-code':
      //   this.horoscopeChartSvg = chartOutput;
      //   break;
      case 'horoscope-chart-url':
        this.horoscopeChart = chartOutput;
        break;
      case 'navamsa-chart-url':
        this.navamsaChart = chartOutput;
        break;
      case 'd2-chart-url':
        this.d2ChartUrl = chartOutput;
        break;
      case 'd3-chart-url':
        this.d3ChartUrl = chartOutput;
        break;
      case 'd4-chart-url':
        this.d4ChartUrl = chartOutput;
        break;
      case 'd5-chart-url':
        this.d5ChartUrl = chartOutput;
        break;
      case 'd6-chart-url':
        this.d6ChartUrl = chartOutput;
        break;
      case 'd7-chart-url':
        this.d7ChartUrl = chartOutput;
        break;
      case 'd8-chart-url':
        this.d8ChartUrl = chartOutput;
        break;
      case 'd10-chart-url':
        this.d10ChartUrl = chartOutput;
        break;
      case 'd11-chart-url':
        this.d11ChartUrl = chartOutput;
        break;
      case 'd12-chart-url':
        this.d12ChartUrl = chartOutput;
        break;
      case 'd16-chart-url':
        this.d16ChartUrl = chartOutput;
        break;
      case 'd20-chart-url':
        this.d20ChartUrl = chartOutput;
        break;
      case 'd24-chart-url':
        this.d24ChartUrl = chartOutput;
        break;
      case 'd27-chart-url':
        this.d27ChartUrl = chartOutput;
        break;
      case 'd30-chart-url':
        this.d30ChartUrl = chartOutput;
        break;
      case 'd40-chart-url':
        this.d40ChartUrl = chartOutput;
        break;
      case 'd45-chart-url':
        this.d45ChartUrl = chartOutput;
        break;
      case 'd60-chart-url':
        this.d60ChartUrl = chartOutput;
        break;

    }
  }

  getAllCharts(){
    // this.getAnyCharts('horoscope-chart-svg-code');
    this.getAnyCharts('horoscope-chart-url');
    this.getAnyCharts('navamsa-chart-url');
    this.getAnyCharts('d2-chart-url');
    this.getAnyCharts('d3-chart-url'); // Not working in north_india chart
    this.getAnyCharts('d4-chart-url');
    this.getAnyCharts('d5-chart-url');
    this.getAnyCharts('d6-chart-url');
    this.getAnyCharts('d7-chart-url');
    this.getAnyCharts('d8-chart-url');
    this.getAnyCharts('d10-chart-url');
    this.getAnyCharts('d11-chart-url');
    this.getAnyCharts('d12-chart-url');
    this.getAnyCharts('d16-chart-url');
    this.getAnyCharts('d20-chart-url');
    this.getAnyCharts('d24-chart-url');
    this.getAnyCharts('d27-chart-url');
    this.getAnyCharts('d30-chart-url');
    this.getAnyCharts('d40-chart-url');
    this.getAnyCharts('d45-chart-url');
    this.getAnyCharts('d60-chart-url');
  }

  getAnyCharts(apiName:any):any{
    this.setLoaderImg(apiName);
    let jsonData = {
      "year": Number(this.year),
      "month": Number(this.month),
      "date": Number(this.date),
      "hours": Number(this.hours),
      "minutes": Number(this.minutes),
      "seconds": Number(this.seconds),
      "latitude": Number(this.latitude),
      "longitude": Number(this.longitude),
      "timezone": Number(this.timezone),
      "config": {
          "observation_point": "topocentric", /* geocentric / topocentric */
          "ayanamsha": "lahiri", /* lahiri / sayana */
          "language":"en" /* te / en */
      },
      "chart_config" :  {
              "font_family":"Mallanna", /* Mallanna / Roboto */
              "hide_time_location":"False", /* True / False */
              "hide_outer_planets":"False", /* True / False */
              "chart_style":this.chartType,  /* south_india / north_india */
              /*"sign_number_font_color":"#A5243D", */ /* works for north_india chart only */
              "native_name":"",
              "native_name_font_size": "20px",
              "native_details_font_size":"15px",
              "chart_border_width":1,
              "planet_name_font_size": "20px",
              "chart_heading_font_size":"25px",            
              "chart_background_color":"#FEE1C7",            
              "chart_border_color":"#B5A886",            
              "native_details_font_color":"#000",            
              "native_name_font_color": "#231F20",            
              "planet_name_font_color": "#BC412B",            
              "chart_heading_font_color":"#2D3319"
          }

    }

    this.sharedService.getAllAstroApiData(jsonData, apiName)
    .subscribe(
      (results)=>{
        const chartData = results;
        let chartOutput = chartData.output;
        if(chartOutput == null)
          chartOutput = this.defaultImg;
        switch(apiName){
          // case 'horoscope-chart-svg-code':
          //   chartOutput = chartOutput.replaceAll("11px", "20px");
          //   this.horoscopeChartSvg = this.sanitizer.bypassSecurityTrustHtml(chartOutput);
          //   break;
          case 'horoscope-chart-url':
            this.horoscopeChart = chartOutput;
            break;
          case 'navamsa-chart-url':
            this.navamsaChart = chartOutput;
            break;
          case 'd2-chart-url':
            this.d2ChartUrl = chartOutput;
            break;
          case 'd3-chart-url':
            this.d3ChartUrl = chartOutput;
            break;
          case 'd4-chart-url':
            this.d4ChartUrl = chartOutput;
            break;
          case 'd5-chart-url':
            this.d5ChartUrl = chartOutput;
            break;
          case 'd6-chart-url':
            this.d6ChartUrl = chartOutput;
            break;
          case 'd7-chart-url':
            this.d7ChartUrl = chartOutput;
            break;
          case 'd8-chart-url':
            this.d8ChartUrl = chartOutput;
            break;
          case 'd10-chart-url':
            this.d10ChartUrl = chartOutput;
            break;
          case 'd11-chart-url':
            this.d11ChartUrl = chartOutput;
            break;
          case 'd12-chart-url':
            this.d12ChartUrl = chartOutput;
            break;
          case 'd16-chart-url':
            this.d16ChartUrl = chartOutput;
            break;
          case 'd20-chart-url':
            this.d20ChartUrl = chartOutput;
            break;
          case 'd24-chart-url':
            this.d24ChartUrl = chartOutput;
            break;
          case 'd27-chart-url':
            this.d27ChartUrl = chartOutput;
            break;
          case 'd30-chart-url':
            this.d30ChartUrl = chartOutput;
            break;
          case 'd40-chart-url':
            this.d40ChartUrl = chartOutput;
            break;
          case 'd45-chart-url':
            this.d45ChartUrl = chartOutput;
            break;
          case 'd60-chart-url':
            this.d60ChartUrl = chartOutput;
            break;

        }
      },
      (error)=>{
        this.openSnackBar(error.error.message);
      }
    )
  }

  openAnyModal(modalName:any){
    $("#"+modalName).modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  closeAnyModal(modalName:any){
    $("#"+modalName).modal("hide");
  }
}
