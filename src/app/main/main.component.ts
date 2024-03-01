import { Component } from '@angular/core';
import { AuthGoogleService } from '../services/auth-google.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  userEmail: string = '';  // user email
  userToken: string = ''; // user access token
  isLoggedIn: boolean = false; // checker isLoggedIn

  constructor(
    private authGoogleService: AuthGoogleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authGoogleService.profileSubject.subscribe(profileData => {
      this.userEmail = profileData.email;
      this.userToken = profileData.token;
      this.isLoggedIn = !!profileData.email;
    });
  }

  logOut() {
    this.authGoogleService.logout();
    this.router.navigate(['login']);
  }
}