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
    {path: 'productos', component: ProductosComponent, canActivate: [authGuardGuard]},
    {path: 'servicios', component: ServiciosComponent, canActivate: [authGuardGuard]},
    {path: 'solicitar-turno', component: SolicitarTurnoComponent, canActivate: [authGuardGuard]},
    {path: 'clientes', component: ClientesComponent, canActivate: [authGuardGuard]},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', redirectTo: 'login'},
   
];