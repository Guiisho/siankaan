import { Component } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { addDoc } from 'firebase/firestore';
import { TurnosService } from '../../../turnos.service';
import { AuthService } from '../../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule
  ],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent {

  servicios: string[] = ['Sesión de coaching', 'Terapia de equilibración', 'Hipnosis de sanación', 'Constelación individual'];
  selectedNombre: string= '';
  selectedTelefono: string= '';
  selectedDate: string= '';
  selectedHora: string= '';
  selectedServicio: string= '';
  turnosReservados: any[] = [];
  today: Date= new Date();
  todayDate: string= '';
  tomorrow: string='';
  horariosOcupados: string[]= [];
  horariosDisponibles= ['9:30', '11:00', '14:00', '15:30', '17:00', 'Consultar otro horario'];
  userName: string | null= null;
  turnoForm: FormGroup;
  isTurnoAsignado: boolean= false; /* Para deshabilitar el botón si ya está asignado */
  mensajeError: string= '';
  turnoAsignado: any = null;
  loading: boolean = true;
  
  constructor(public firestore: Firestore, 
    private fb:FormBuilder, 
    public turnoService: TurnosService,
    public authService: AuthService){


      this.authService.getAuthState().subscribe(user => {
        if(user) {
          this.userName= user.displayName || user.email; /* Guarda el nombre o email del usuario */
        }
      }) 

      this.turnoForm = this.fb.group({
        nombre: ['', Validators.required],
        telefono: ['', Validators.required],
        hora: ['', Validators.required],
        dia: ['', Validators.required],
        servicio: ['', Validators.required]
      });

      this.turnoForm.get('date')?.valueChanges.subscribe(date => {
        this.turnoService.getTurnosByDate(date).then(turnos =>{
          this.horariosOcupados= turnos.map(turno => turno['time'])
        });
      });

  }

  

   ngOnInit():void{

    this.authService.getCurrentUser().then((user) =>{
      if (user && user.email){
        const userEmail = user.email;

        this.getTurnoAsignado(userEmail);
      } else {
        console.log('Error, no se pudo obtener el email del usuario');
      }
    }).catch((error) => {
      console.log('Error', error)
    })
    
    this.todayDate= this.today.toISOString().split('T') [0]; /* Obtiene la fecha de hoy */
    /* Calcula la fecha de mañana */
    const tomorrow= new Date(this.todayDate);
    tomorrow.setDate(this.today.getDate()+1); /* NOTA: Si pongo +1 al lado de getDate() toma el valor de pasado mañana */
    this.tomorrow= tomorrow.toISOString().split('T') [0];

  }

  /* Método para verificar si una hora está deshabilitada (ocupada) */
  isDisabled(hora: string): boolean{
    return this.horariosOcupados.includes(hora);
  }

/* Método que guarda los datos del usuario en Firebase Storage */
  obtenerTurnos() {
    const turnos= collection(this.firestore, 'turnos');
    return collectionData(turnos);
  }

  /* Método que guarda y valida los datos del usuario */
 solicitarTurno() {
  const userId= this.authService.getUserId();
  if(!userId){
    console.log('El id del usuario no es válido.');
    this.mensajeError= 'Debe iniciar sesión para solicitar el turno';
    return;
  }

  this.authService.getCurrentUser().then((user) =>{
    if(user && user.uid){
      const turno= {
        usuario: user.email, /* Obtiene el ID del usuario actual */
        nombre: this.selectedNombre,
        telefono: this.selectedTelefono,
        fecha: this.selectedDate,
        hora: this.selectedHora,
        servicio: this.selectedServicio,
        estado: 'reservado'
      };
    
       /* Guarda el turno en Firebase */
  this.turnoService.addTurno(turno).then(() =>{

    /* Guarda el turno localmente para mostrarlo después */
    this.turnoAsignado= turno;

     /* Actualiza la lista de turnos ocupados */
    this.checkTurnosReservados(); /* Actualiza lista de turnos ocupados */

     /* Deshabilita el formulario para evitar que el usuario solicite otro turno */
    this.turnoForm.disable();
  }).catch((error) =>{
    console.log('Error al solicitar el turno:', error);
  });
    }
  })
 
  /* Verifica si ya está reservado el turno */
  if(this.horariosOcupados.includes(this.selectedHora)) {
    this.mensajeError= 'El turno ya ha sido asignado para esa hora.';
    return;
  }
}

  onSubmit() {
    const {nombre, telefono, fecha, hora, servicio} = this.turnoForm.value;
    const turnosCollection= collection (this.firestore, 'turnos');
    addDoc( turnosCollection, {
      nombre,
      telefono,
     fecha,
     hora,
     servicio
    })
}

  checkTurnosReservados() {
  const turnosRef = collection(this.firestore, 'turnos');
  collectionData(turnosRef).subscribe((turnos: any[]) => {
    /* Filtra los turnos para la fecha seleccionada */
    const turnosParaFecha = turnos.filter(turno => turno.fecha === this.selectedDate);
    /* Mapea las horas ocupadas */
    this.horariosOcupados = turnosParaFecha.map(turno => turno.hora);
    });
  }

  /* Método para obtener el turno asignado del usuario */
  getTurnoAsignado(userId: string){
    
    this.turnoService.getUserTurno(userId).then((querySnapshot) => {
     if (!querySnapshot.empty) {
      const turnos = querySnapshot.docs.map(doc => doc.data())
      console.log('Turno recuperado', turnos);
      
      if(turnos.length > 0){
        this.turnoAsignado= turnos [0]; /* Agarra el primer valor/turno si existe */
        console.log('turno asignado', this.turnoAsignado);

        this.turnoForm.disable(); /* Se deshabilita el formulario si el turno existe */
      } else {
        console.log('No se encontró un turno para este usuario'); /* Si no hay turno, el formulario estará habilitado */
      }
     } else {
      console.log('No se encontraron turnos en la base de datos para este usuario');
     }
    }).catch(error =>{
      console.log('Error obteniendo el turno', error)
    })
  }
}

