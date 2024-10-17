import { Component } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { TurnosService } from '../../../turnos.service';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent {

  turnoForm: FormGroup;
  
  constructor(public firestore: Firestore, 
    private fb:FormBuilder, 
    public turnoService: TurnosService){
      this.turnoForm = this.fb.group({
        nombre: ['', Validators.required],
        hora: ['', Validators.required],
        dia: ['', Validators.required],
        servicio: ['', Validators.required]
      });
  }

  onSubmit() {
   const {nombre, dia, hora, servicio} = this.turnoForm.value;
   const turnosCollection= collection (this.firestore, 'turnos');
   addDoc( turnosCollection, {
    nombre,
    dia,
    hora,
    servicio
   }).then(() => {
    console.log('Turno guardado con éxito');
   })
    };

  obtenerTurnos() {
    const turnos= collection(this.firestore, 'turnos');
    return collectionData(turnos);
  }

  agregarTurnos(){
    const turnos= collection(this.firestore, 'turnos');
    return addDoc(turnos, turnos);
  }

  actualizarTurnos(id: string, turno: any){
    const turnoDoc= doc(this.firestore, `turnos/${id}`);
    return updateDoc(turnoDoc, turno, id);
  }

  eliminarTurno(id: string){
    const turnoDoc= doc (this.firestore, `turnos/${id}`);
    return deleteDoc(turnoDoc);
  }
}


