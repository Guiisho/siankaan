import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, getDocs } from '@angular/fire/firestore';
import { doc, query, updateDoc, where } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {
  constructor(private firestore: Firestore) {}

  // Método para obtener turnos en tiempo real como un Observable
  obtenerTurnos(): Observable<any[]> {
    const turnosCollection = collection(this.firestore, 'turnos');  // Crear referencia a la colección 'turnos'
    return collectionData(turnosCollection, { idField: 'id' });  // Retornar los datos como un observable
  }

  // Método para añadir un nuevo turno a la colección
  async addTurno(turno: any): Promise<void> {
    const turnosCollection = collection(this.firestore, 'turnos');  // Referencia a la colección 'turnos'
    await addDoc(turnosCollection, turno);  // Añadir un nuevo documento a la colección
  }

  // Obtener todos los turnos una vez (sin Observable)
  async getTurnosOnce(): Promise<any[]> {
    const turnosCollection = collection(this.firestore, 'turnos');  // Referencia a la colección 'turnos'
    const snapshot = await getDocs(turnosCollection);  // Obtener todos los documentos de la colección
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));  // Mapear los datos obtenidos
  }

  async getTurnosByDate(dia: string){
    const turnosRef= collection(this.firestore, 'turnos');
    const q= query(turnosRef, where('dia', '==', dia));
    const querySnapshot= await getDocs(q);
    const turnos= querySnapshot.docs.map(doc => doc.data());
    return turnos;
  }

  /* Guarda el turno en Firestore */
  solicitarTurno(turno: any){
    const turnosRef= collection(this.firestore, 'turnos')
    return addDoc(turnosRef, turno); /* agrega el turno a la colección turnos */
  }

  // Método para cancelar un turno
  cancelarTurno(turnoId: string): Promise<void> {
    const turnoRef = doc(this.firestore, 'turnos', turnoId);
    return updateDoc(turnoRef, { estado: 'cancelado' });
  }

  // Método para liberar turnos pasados
  liberarTurnosPasados() {
    const today = new Date().toISOString().split('T')[0]; // Obtener la fecha actual
    const turnosCollection = collection(this.firestore, 'turnos');
    const queryTurnosPasados = query(turnosCollection, where('fecha', '<', today), where('estado', '==', 'reservado'));
  
    getDocs(queryTurnosPasados).then(snapshot => {
      snapshot.forEach(doc => {
        updateDoc(doc.ref, { estado: 'completado' });
      });
    });
  }
}
