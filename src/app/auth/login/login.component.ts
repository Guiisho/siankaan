import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Auth } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Toast } from 'bootstrap';  // Importa solo el componente Toast

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  userNotFound: boolean = false;
  invalidCredentials: boolean = false;
  @ViewChild('errorToast') errorToast!: ElementRef;

  constructor(
    private fb: FormBuilder, 
    public authService: AuthService,
    private auth: Auth 
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/)
      ]]
    });
  }

  /* Método para loguear un usuario registrado */
  async onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        await this.authService.login(email, password);
        const user = this.auth.currentUser;
        if (user) {
          // Redirigir a la vista correspondiente según el rol
          this.authService.getUserRole(user.uid).then((role) => {
            if (role === 'admin') {
              this.authService.router.navigate(['/home']);
              console.log('Bienvenido administrador');
            } else {
              this.authService.router.navigate(['/home']);
              console.log('Bienvenido');
            }
          });
        }
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          this.userNotFound = true;
          this.invalidCredentials = false;
        } else if (error.code === 'auth/wrong-password') {
          this.userNotFound = false;
          this.invalidCredentials = true;
        } else {
          this.userNotFound = false;
          this.invalidCredentials = false;
          
          // Muestra el toast solo si no es un error de usuario inexistente o contraseña incorrecta
          const toast = new Toast(this.errorToast.nativeElement);
          toast.show();
        }
      }
    }
  }
  
  

  handleError(error: any): void {
    this.userNotFound = false;
    this.invalidCredentials = false;

    if (error.code === 'auth/user-not-found') {
      this.userNotFound = true;
    } else if (error.code === 'auth/wrong-password') {
      this.invalidCredentials = true;
    } else {
      // Si hay otro error, puedes mostrar un toast
      const toast = new Toast(this.errorToast.nativeElement);
      toast.show(); // Muestra el toast de error
    }
  }
}
