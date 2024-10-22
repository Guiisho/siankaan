import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './interfaces/home/home.component';
import { SolicitarTurnoComponent } from './interfaces/user/solicitar-turno/solicitar-turno.component';
import { ClientesComponent } from './interfaces/admin/clientes/clientes.component';
import { authGuardGuard } from './auth/auth-guard.guard';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'home', component: HomeComponent, canActivate: [authGuardGuard]},
    {path: 'solicitar-turno', component: SolicitarTurnoComponent, canActivate: [authGuardGuard]},
    {path: 'clientes', component: ClientesComponent, canActivate: [authGuardGuard]},
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: '**', redirectTo: 'login'},
   
];