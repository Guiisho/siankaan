import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, 
    public authService: AuthService,
    private auth: Auth 
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid){
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).then(() => {
      const user = this.auth.currentUser;
      if (user) {

         // Redirigir a la vista de CRUD si es admin
        this.authService.getUserRole(user.uid).then((role) => {
          if (role === 'admin') {
             // Redirigir a la vista de CRUD si es admin
             this.authService.router.navigate(['/clientes']);
          } else {
            // Redirigir a la vista home si es usuario normal
            this.authService.router.navigate(['/home']);
          }
        })
      }
    })};
  }
}
