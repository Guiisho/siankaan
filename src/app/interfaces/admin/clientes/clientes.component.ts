import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { TurnosService } from '../../../turnos.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {


  turnos$: Observable<any[]>;
  turnos: any[] = [];
  servicios: string[] = ['Consulta General', 'Terapia', 'Constelación'];
  horariosDisponibles= ['9:00', '11:00', '13:00', '15:00', '17:00'];
  today: Date= new Date();
  todayDate: string= '';
  tomorrow: string='';
  turnoForm: FormGroup;
  isAddTurno: boolean = false;

  constructor(private firestore: Firestore,
    private fb: FormBuilder,
    private turnoService: TurnosService
  ){

    this.turnoForm= this.fb.group({
      nombre:['', Validators.required],
      telefono:['', Validators.required],
      usuario:['', Validators.required],
      hora:['', Validators.required],
      fecha:['', Validators.required],
      servicio:['', Validators.required]
    })

    const turnosCollection= collection(this.firestore, 'turnos');
    this.turnos$= collectionData(turnosCollection, { idField: 'id'});

  }

  ngOnInit(): void{
    this.obtenerTurnos();

    this.todayDate= this.today.toISOString().split('T') [0]; /* Obtiene la fecha de hoy */
    /* Calcular la fecha de mañana */
    const tomorrow= new Date(this.todayDate);
    tomorrow.setDate(this.today.getDate()+1); /* NOTA: Si pongo +1 al lado de getDate() toma el valor de pasado mañana */
    this.tomorrow= tomorrow.toISOString().split('T') [0];
  }

  /* Obtiene los turnos asignados por los usuarios */
  async obtenerTurnos(){
    const turnosCollection= collection(this.firestore, 'turnos');
    const turnosSnapshot= await getDocs (turnosCollection);
    this.turnos= turnosSnapshot.docs.map(doc=> ({id:doc.id, ...doc.data()}))
  }

  /* Eliminar turno del usuario */

  async eliminarTurno(id: string): Promise<void>{
    const turnoDocRef= doc(this.firestore,  `turnos/${id}`);
    await deleteDoc(turnoDocRef);
    /* Filtra el turno eliminado del arreglo local de turnos */
    this.turnos = this.turnos.filter(turno => turno.id !== id);
    }

    addTurno(){
      const turno= {
        nombre: this.turnoForm.value.nombre,
        telefono: this.turnoForm.value.telefono,
        usuario: this.turnoForm.value.usuario,
        hora: this.turnoForm.value.hora,
        fecha: this.turnoForm.value.fecha,
        servicio: this.turnoForm.value.servicio
      };

      this.turnoService.addTurno(turno).then(() =>{
        console.log('Cliente añadido correctamente');
        this.turnoForm.reset();
        
        /* Añade el turno a la lista de turnos para que se muestre sin recargar la página */
        this.turnos.push(turno); /* actualiza la lista localmente */
        
      }).catch((error) =>{
        console.log('Error al añadir al cliente', error)
      })
    }

}


