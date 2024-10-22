import { Component } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { addDoc, deleteDoc, doc, QuerySnapshot } from 'firebase/firestore';
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

  servicios: string[] = ['Consulta General', 'Terapia', 'Constelación'];
  selectedDate: string= '';
  selectedHora: string= '';
  selectedServicio: string= '';
  turnosReservados: any[] = [];
  todayDate: string= '';
  horariosOcupados: string[]= [];
  horariosDisponibles= ['9:00', '11:00', '13:00', '15:00', '17:00'];
  userName: string | null= null;
  turnoForm: FormGroup;
  isTurnoAsignado: boolean= false; /* Para deshabilitar el botón si ya está asignado */
  mensajeError: string= '';
  turnoAsignado: any = null;
  
  constructor(public firestore: Firestore, 
    private fb:FormBuilder, 
    public turnoService: TurnosService,
    public authService: AuthService){

      const today= new Date();
      this.todayDate= today.toISOString().split('T') [0];

      this.authService.getAuthState().subscribe(user => {
        if(user) {
          this.userName= user.displayName || user.email; /* Guarda el nombre o email del usuario */
        }
      }) 

      this.turnoForm = this.fb.group({
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

   ngOnInit(): void{
    this.authService.getCurrentUser().then((user) => {
      if (user && user.uid) {
        const userId = user.uid;
  
        this.turnoService.getUserTurno(userId).then((querySnapshot) => {
          const turnos = querySnapshot.docs.map(doc => doc.data());
  
          if (turnos.length > 0) {
            this.turnoAsignado = turnos[0]; // Asigna el primer turno encontrado
            this.turnoForm.disable(); // Desactiva el formulario
          }
        }).catch(error => {
          console.error('Error obteniendo el turno:', error);
        });
      }
    }).catch(error => {
      console.error('Error obteniendo el usuario actual:', error);
    });
  }

  isDisabled(hora: string): boolean{
    return this.horariosOcupados.includes(hora);
  }

/* Método que guarda los datos del usuario en Firebase Storage */
  obtenerTurnos() {
    const turnos= collection(this.firestore, 'turnos');
    return collectionData(turnos);
  }

  /* Método que guarda y valida los datos del usuario */
 solicitarTurno(){
  const turno={
    usuarioId: this.authService.getUserId(), /* Obtener el ID del usuario actual */
    fecha: this.selectedDate,
    hora: this.selectedHora,
    servicio: this.selectedServicio,
    estado: 'reservado'
  };


  /* Verificar si ya está reservado el turno */
  if(this.horariosOcupados.includes(this.selectedHora)){
    this.mensajeError= 'El turno ya ha sido asignado para esa hora.';
  }

  this.turnoService.solicitarTurno(turno).then(() =>{
    alert('Turno solicitado exitosamente');
    this.turnoAsignado= turno;
    this.checkTurnosReservados(); /* Actualizar lista de turnos ocupados */
    this.isTurnoAsignado= true; /* Deshabilitar el botón tras la asignación */
    this.turnoForm.disable();
  }).catch((error) =>{
    console.log('Error al solicitar el turno:', error);
  })
 }

 /* Método que elimina el turno, válido para el admin */
  eliminarTurno(id: string){
    const turnoDoc= doc (this.firestore, `turnos/${id}`);
    return deleteDoc(turnoDoc);
  }

  onSubmit() {
    const {dia, hora, servicio} = this.turnoForm.value;
    const turnosCollection= collection (this.firestore, 'turnos');
    addDoc( turnosCollection, {
     dia,
     hora,
     servicio
    })
}

checkTurnosReservados() {
  const turnosRef = collection(this.firestore, 'turnos');
  collectionData(turnosRef).subscribe((turnos: any[]) => {
    // Filtrar turnos para la fecha seleccionada
    const turnosParaFecha = turnos.filter(turno => turno.dia === this.selectedDate);
    // Mapear las horas ocupadas
    this.horariosOcupados = turnosParaFecha.map(turno => turno.hora);
  });
}

}

