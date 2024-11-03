import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, public authService: AuthService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/)
      ]]
    });
  }

  /* Método para registrar un usuario */
  onRegister() {
    const {email, password } = this.registerForm.value;
    this.authService.register(email, password).then(() => {
      
    });
  }

  passwordInvalid(): boolean {
    const passwordControl = this.registerForm.get('password');
    
    // Verificamos si passwordControl es null antes de acceder a sus propiedades
    return !!(passwordControl && passwordControl.invalid && (passwordControl.touched || passwordControl.dirty));
  }

  emailInvalid(): boolean {
    const emailControl = this.registerForm.get('email');
    
    // Verificamos si passwordControl es null antes de acceder a sus propiedades
    return !!(emailControl && emailControl.invalid && (emailControl.touched || emailControl.dirty));
  }

}
