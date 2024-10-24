import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {


  turnos$: Observable<any[]>;
  turnos: any[] = [];

  constructor(private firestore: Firestore){
    const turnosCollection= collection(this.firestore, 'turnos');
    this.turnos$= collectionData(turnosCollection, { idField: 'id'});
  }

  ngOnInit(): void{
    this.obtenerTurnos();
  }

  /* Obtiene los turnos asignados por los usuarios */
  async obtenerTurnos(){
    const turnosCollection= collection(this.firestore, 'turnos');
    const turnosSnapshot= await getDocs (turnosCollection);
    this.turnos= turnosSnapshot.docs.map(doc=> ({id:doc.id, ...doc.data()}))
  }


  /* Eliminar turno del usuario */

  eliminarTurno(id: string): Promise<void>{
    const turnoDocRef= doc(this.firestore,  `turnos/${id}`);
    return deleteDoc(turnoDocRef)
    };

}
