import { Injectable } from "@angular/core"; 
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from "@angular/fire/auth";
import { doc, Firestore, getDoc, setDoc } from "@angular/fire/firestore";
import { Router } from "@angular/router"; 
import { onAuthStateChanged, signOut } from "firebase/auth";

@Injectable({
    providedIn: "root"
})

export class AuthService{

    public user: any= null;
    public userRole: string | null = null;

    constructor( public router: Router,
        private auth: Auth,
        private firestore: Firestore,
    ) {
        onAuthStateChanged(this.auth, (user) =>{
            if(user){
                this.user= user;
                this.getUserRole(user.uid);
            } else{
                this.user= null;
            }
        })
    }
    
    getAuthState(){
        return authState(this.auth);
    }
   


    /* Inicia sesión si el usuario está registrado */
    async login(email: string, password: string) {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        const user = userCredential.user;
    
        if (user) {
            const role= email === 'alarconguille556@gmail.com' ? 'admin' : 'user';
            const userDocRef= doc(this.firestore, `users/${user.uid}`);
            await setDoc(userDocRef, {
                email: user.email,
                role: role,
            });
          this.getUserRole(user.uid); // Verifica el rol después del inicio de sesión
        }
      }

    /* Registra al usuario con un rol específico */
    async register(email: string, password: string, isAdmin: boolean){
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(this.firestore, 'users', user.uid), {
                email: user.email,
                role: isAdmin ? 'admin' : 'user'
            });
        } catch (error) {
            console.log('Error al registrar', error);
        }
          /* Si el usuario tiene este email, es admin */
          if (this.user) {
            const role= email === 'alarconguille556@gmail.com' ? 'admin' : 'user';
            const userDocRef= doc(this.firestore, `users/${this.user.uid}`);
             setDoc(userDocRef, {
                email: this.user.email,
                role: role,
            });
          this.getUserRole(this.user.uid); // Verifica el rol después del inicio de sesión
          this.router.navigate(['/login']);
        } else {
            this.router.navigate(['/login']);
        }
       
    }

    /* Obtener el rol del usuario actual */

    async getUserRole(uid: string) {
        const userDoc= doc(this.firestore, 'users', uid);
        const docSnapshot = await getDoc(userDoc);
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            return data ? data['role'] : null;
        }
    }

     // Método para obtener el UID del usuario autenticado
  getUserId(): string | null {
    const currentUser = this.auth.currentUser;
    return currentUser ? currentUser.uid : null;
  }

      /*Cierra sesión y vuelve al apartado Login*/
      async logOut(){
        await signOut(this.auth);
        this.userRole= null;
        this.router.navigate(['/login']); /* Redirige al apartado Login después de cerrar sesión */
    }
}