import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './interfaces/home/home.component';
import { SolicitarTurnoComponent } from './interfaces/user/solicitar-turno/solicitar-turno.component';
import { ClientesComponent } from './interfaces/admin/clientes/clientes.component';
import { authGuardGuard } from './auth/auth-guard.guard';
import { ProductosComponent } from './interfaces/productos/productos.component';
import { ServiciosComponent } from './interfaces/servicios/servicios.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'home', component: HomeComponent,},
    {path: 'productos', component: ProductosComponent, canActivate: [authGuardGuard]}, /* Ruta protegida */
    {path: 'servicios', component: ServiciosComponent, canActivate: [authGuardGuard]}, /* Ruta protegida */
    {path: 'solicitar-turno', component: SolicitarTurnoComponent, canActivate: [authGuardGuard]}, /* Ruta protegida */
    {path: 'clientes', component: ClientesComponent, canActivate: [authGuardGuard]}, /* Ruta protegida */
    {path: '', redirectTo: 'home', pathMatch: 'full'}, /* La página inicializa en Home */
    {path: '**', redirectTo: 'home'}, /*Si no existe el path, redirige a Home */
   
];