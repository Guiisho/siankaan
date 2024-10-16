import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './interfaces/home/home.component';
import { SolicitarTurnoComponent } from './interfaces/user/solicitar-turno/solicitar-turno.component';
import { ClientesComponent } from './interfaces/admin/clientes/clientes.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'home', component: HomeComponent},
    {path: 'solicitar-turno', component: SolicitarTurnoComponent},
    {path: 'clientes', component: ClientesComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: '**', redirectTo: 'login'},
   
];