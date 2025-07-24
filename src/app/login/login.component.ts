import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constant } from '../shared/constant/Contant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared/service/SharedService';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  timeLeft: number = 60; // in seconds
  interval:any;
  isLogin: boolean = true;
  loginForm: FormGroup;
  otpForm: FormGroup;
  constructor(private sharedService : SharedService, private router:Router, private fb: FormBuilder, 
    private _snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      // email: ['jai.prakash@trinity.applab.co.in', [Validators.required, Validators.email]],
      // password: ['j@i@123', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(4), Validators.maxLength(4)]],
    });
  }

  ngOnInit(): void {
  }

  openSnackBar(message:any) {
    this._snackBar.open(message, '', {
      duration: 1000,
      panelClass: ['snackbar-bg'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        // this.timeLeft = 60;
        this.pauseTimer();
      }
    },1000)
  }

  pauseTimer() {
    this.timeLeft = 60;
    clearInterval(this.interval);
  }
  

  onSubmit() {
    if (this.loginForm.valid) {
      // this.isLogin = false;
      const credentials = this.loginForm.value;
      let jsonData = JSON.stringify(credentials);
      this.sharedService.getOTP(jsonData)
      .subscribe(
        (results)=>{
          localStorage.setItem("mobile",this.loginForm.value.mobile);
          this.isLogin = false;
          this.openSnackBar(results.message);
          this.startTimer();
        },
        (error)=>{
          this.openSnackBar(error.error.message)
        }
      )
    }
  }

  resendOTP(){
    this.startTimer();
    let jsonData = {
      mobile: this.loginForm.value.mobile
    }
    this.sharedService.getOTP(jsonData)
    .subscribe(
      (results)=>{
        this.openSnackBar(results.message);
      },
      (error)=>{

      }
    )
  }

  validateOTP(){
    if (this.otpForm.valid) {
      // const otpCredentials = this.otpForm.value;
      let jsonData = {
        mobile: this.loginForm.value.mobile,
        otp: this.otpForm.value.otp,
      }
      this.sharedService.validateOTP(jsonData)
      .subscribe(
        (results)=>{
          if(results.code == 200){
            localStorage.setItem(btoa("isValidToken"),btoa(Constant.ASTRO_PRIVATE_KEY));
            this.router.navigate(['/layout']);
          }
          else{
            this.openSnackBar(results.message);
          }
        },
        (error)=>{
          this.openSnackBar(error.message);
        }
      )
    }
  }

}
