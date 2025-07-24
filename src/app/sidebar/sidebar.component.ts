import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  mobile:any = "";
  isCollapsed = false;

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.mobile = localStorage.getItem("mobile");
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(){
    // alert("alert")
    let isConfirm = confirm("Do you want to logout?");
    if(!isConfirm){
      return;
    }
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
