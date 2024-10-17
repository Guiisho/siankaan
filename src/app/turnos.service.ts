import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {
  constructor(private firestore: Firestore) {}

  // Método para obtener turnos en tiempo real como un Observable
  getTurnos(): Observable<any[]> {
    const turnosCollection = collection(this.firestore, 'turnos');  // Crear referencia a la colección 'turnos'
    return collectionData(turnosCollection, { idField: 'id' });  // Retornar los datos como un observable
  }

  // Método para añadir un nuevo turno a la colección
  addTurno(turno: any): Promise<void> {
    const turnosCollection = collection(this.firestore, 'turnos');  // Referencia a la colección 'turnos'
    return addDoc(turnosCollection, turno).then(() => {});  // Añadir un nuevo documento a la colección
  }

  // Obtener todos los turnos una vez (sin Observable)
  async getTurnosOnce(): Promise<any[]> {
    const turnosCollection = collection(this.firestore, 'turnos');  // Referencia a la colección 'turnos'
    const snapshot = await getDocs(turnosCollection);  // Obtener todos los documentos de la colección
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));  // Mapear los datos obtenidos
  }
}
