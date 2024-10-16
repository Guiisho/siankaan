import { Injectable } from "@angular/core"; 
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@angular/fire/auth";
import { Router } from "@angular/router"; 

@Injectable({
    providedIn: "root"
})

export class AuthService{
    getCurrentUser: any;

    constructor( private router: Router,
        private auth: Auth  
    ) {}


    /* Inicia sesión si el usuario está registrado */
    login(email: string, password: string){
        return signInWithEmailAndPassword(this.auth, email, password)
        .then((exito) =>{
            console.log('inicio de sesión exitoso', exito)
            this.router.navigate(['/home'])
        })
        .catch((error) =>{
            console.log('El email o la contraseña son inválidos', error)
        })
    }

    /* Registra al usuario */
    register(email: string, password: string){
        return createUserWithEmailAndPassword(this.auth, email, password)
        .then((exito) => {
            console.log('Registro exitoso', exito)
            this.router.navigate(['/login']);
        })
        .catch((error) =>{
            console.log('Error al registrar',error);
        })
    }

    /*Cierra sesión y vuelve al apartado Login*/
    logOut(){
        return this.auth.signOut().then(() =>{
            this.router.navigate(['/login']);
        });
    }
}