import { Component } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  
  constructor(private firestore: Firestore, 
    private fb:FormBuilder, 
    private turnoService: TurnosService){
      this.turnoForm = this.fb.group({
        hora: [''],
        dia: [''],
        servicio: ['']
      });
  }

  onSubmit() {
    this.turnoService.agregarTurno(this.turnoForm.value).then(() => {
      // Mensaje de éxito
    });
  }

  obtenerTurnos() {
    const turnos= collection(this.firestore, 'turnos');
    return collectionData(turnos);
  }

  agregarTurnos(){
    const turnos= collection(this.firestore, 'turnos');
    return addDoc(turnos, turnos);
  }

  actualizarTurnos(id: string, turno: any){
    const turnoDoc= doc(this.firestore, 'turnos/${id}');
    return updateDoc(turnoDoc, turno);
  }

  eliminarTurno(){
    const turnoDoc= doc (this.firestore, 'turnos/${id}');
    return deleteDoc(turnoDoc);
  }
}


