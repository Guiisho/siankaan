import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {
  constructor(private firestore: AngularFirestore) {}

  agregarTurno(turno: any) {
    return this.firestore.collection('turnos').add(turno);
  }

  obtenerTurnos() {
    return this.firestore.collection('turnos').snapshotChanges();
  }

  actualizarTurno(id: string, turno: any) {
    return this.firestore.collection('turnos').doc(id).update(turno);
  }

  eliminarTurno(id: string) {
    return this.firestore.collection('turnos').doc(id).delete();
  }
}
