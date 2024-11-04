import { Injectable } from "@angular/core"; 
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@angular/fire/auth";
import { doc, Firestore, getDoc, setDoc } from "@angular/fire/firestore";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root"
})

export class AuthService{

    currentUser: any = null;
    public user: any= null;
    public userRole: string | null = null;

    // Define una lista de correos electrónicos con rol de administrador
    private adminEmails: string[] = ['alarconguille556@gmail.com', 'blanca9776@gmail.com'];

    constructor( public router: Router,
        private auth: Auth,
        private firestore: Firestore,
    ) {
        this.auth.onAuthStateChanged(user =>{
            if(user){
                this.currentUser= user;
            } else {
                this.currentUser= null;
            }
        })
    }

    getCurrentUser(): Promise<any> {
        return new Promise((resolve, reject) => {
          this.auth.onAuthStateChanged((user) => {
            if (user) {
              resolve(user); /* Usuario autenticado */
            } else {
              reject(null);  /* No hay usuario autenticado */
            }
          }, error => {
            reject(error);
          });
        });
      }

    getAuthState(){
        return authState(this.auth);
    }

    isLoggedIn(): boolean {
        return this.currentUser != null;
    }

    async login(email: string, password: string) {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        const user = userCredential.user;

        if (user) {
            // Verifica si el correo está en la lista de administradores
            const role = this.adminEmails.includes(email) ? 'admin' : 'user';
            const userDocRef = doc(this.firestore, `users/${user.uid}`);
            await setDoc(userDocRef, {
                email: user.email,
                role: role,
            });
            this.getUserRole(user.uid); /* Verifica el rol después del inicio de sesión */
        }
    }

    async register(email: string, password: string){
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;

            // Verifica si el correo está en la lista de administradores
            const role = this.adminEmails.includes(email) ? 'admin' : 'user';

            await setDoc(doc(this.firestore, `users/${user.uid}`), {
                email: user.email,
                role: role
            });
            this.router.navigate(['/home']); // Redirige después del registro
        } catch (error) {
            console.log('Error al registrar', error);
        }
    }

    async getUserRole(uid: string) {
        const userDoc = doc(this.firestore, 'users', uid);
        const docSnapshot = await getDoc(userDoc);
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            return data ? data['role'] : null;
        }
    }

    async getUserId(): Promise<string | null> {
        const user = await this.getCurrentUser();
        return user ? user.uid : null;
    }

    async logOut(){
        await this.auth.signOut().then(() => {
            this.router.navigate(['/login']);
        });
        this.userRole = null;
        this.router.navigate(['/login']); /* Redirige al apartado Login después de cerrar sesión */
    }
}
