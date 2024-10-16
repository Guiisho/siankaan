import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isAdmin: boolean= false;

  constructor(public authService:AuthService){
    this.authService.getCurrentUser();((user: { email: string; }) => {
      if (user?.email === 'alarconguille556@gmail.com'){
        this.isAdmin= true;
      }
    })
  }

  logOut(){
    this.authService.logOut();
  }
}
