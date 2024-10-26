import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isAuthenticated: boolean= false;
  isLoggedIn: boolean= false;
  isAdmin: boolean= false;

  constructor(public authService:AuthService) {
    this.authService.getAuthState().subscribe(user => {
      if(user){
        this.isLoggedIn= true;

        this.authService.getUserRole(user.uid).then(role => {
          this.isAdmin= role === 'admin';
        });
      } else{
        this.isLoggedIn= false;
      }
    });
  }

  ngOnInit(): void {
  }

 
  logOut(){
    this.authService.logOut();
  }
}
