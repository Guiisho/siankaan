import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

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

 
  logOut(){
    this.authService.logOut();
  }
}
