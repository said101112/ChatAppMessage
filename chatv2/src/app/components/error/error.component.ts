import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit {

  errorMessage: string = '';
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}
  code!: number;
  message = '';
  ngOnInit() {
  this.code = Number(this.route.snapshot.paramMap.get('code'));

    switch (this.code) {
      case 401:
        this.message = 'Unauthorized – You are not allowed to access this page.';
        break;
      case 403:
        this.message = 'Forbidden – Access is denied.';
        break;
      case 404:
        this.message = 'Page Not Found – The page you requested does not exist.';
        break;
      case 500:
        this.message = 'Server Error – Something went wrong on our side.';
        break;
      default:
        this.message = 'An unexpected error occurred.';
        break;
    }
  }

  goBack() {
    this.location.back();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  reloadPage() {
    window.location.reload();
  }


}
