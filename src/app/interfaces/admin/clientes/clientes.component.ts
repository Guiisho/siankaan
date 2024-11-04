import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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


  turnoId: string= '';
  turnoSeleccionado: any = null;
  turnos$: Observable<any[]>;
  turnos: any[] = [];
  servicios: string[] = ['Consulta General', 'Terapia', 'Constelación'];
  horariosDisponibles= ['9:00', '11:00', '13:00', '15:00', '17:00'];
  today: Date= new Date();
  todayDate: string= '';
  tomorrow: string='';
  turnoForm: FormGroup;
  isAddTurno: boolean = false;
  // Variable para almacenar el cliente seleccionado
clienteSeleccionado: any = null;

  constructor(private firestore: Firestore,
    private fb: FormBuilder,
    private turnoService: TurnosService,
    private route: ActivatedRoute
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
    /* Muestra los turnos generados por el usuario o creados por el admin */
    this.obtenerTurnos();

      /* Escucha cambios en tiempo real de la colección de turnos */
      this.turnoService.obtenerTurnos().subscribe((data) => {
        this.turnos = data;
      });

    this.todayDate= this.today.toISOString().split('T') [0]; /* Obtiene la fecha de hoy */
    /* Calcular la fecha de mañana */
    const tomorrow= new Date(this.todayDate);
    tomorrow.setDate(this.today.getDate()+1); /* NOTA: Si pongo +1 al lado de getDate() toma el valor de pasado mañana */
    this.tomorrow= tomorrow.toISOString().split('T') [0];

    const id= this.route.snapshot.paramMap.get('id');
    console.log(id);

    this.turnoId= this.route.snapshot.paramMap.get('id') || '';
    this.turnoForm= this.fb.group({
      nombre:['', Validators.required],
      telefono:['', Validators.required],
      usuario:['', Validators.required],
      hora:['', Validators.required],
      fecha:['', Validators.required],
      servicio:['', Validators.required]
    })
    

    this.turnoService.getUserTurno(this.turnoId).then((snapshot =>{
      if (!snapshot.empty){
        const turnoData= snapshot.docs[0].data();
        this.turnoForm.patchValue(turnoData);
      }
    }))

  }

  /* Obtiene los turnos asignados por los usuarios */
  async obtenerTurnos(){
    const turnosCollection= collection(this.firestore, 'turnos');
    const turnosSnapshot= await getDocs (turnosCollection);
    this.turnos= turnosSnapshot.docs.map(doc=> ({id:doc.id, ...doc.data()}))
  }


  /* Eliminar turno del usuario */
  async eliminarTurno(id: string): Promise<void>{
    const turnoDocRef= doc(this.firestore, 'turnos/' + id);
    await deleteDoc(turnoDocRef);
    /* Filtra el turno eliminado del arreglo local de turnos */
    this.turnos = this.turnos.filter(turno => turno.id !== id);
    }

    /* Añadir el turno de un usuario */
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

    /* Guarda los cambios de la modificación del turno del usuario */
    guardarCambios(): void {
      if (this.turnoSeleccionado) {
        /* Si hay un turno seleccionado, es una edición */
        this.turnoService.editarTurno(this.turnoSeleccionado.id, this.turnoForm.value)
          .then(() => {
            console.log('Turno actualizado exitosamente');
            this.turnoSeleccionado = null;  /* Limpiar la selección */
            this.turnoForm.reset();
          })
          .catch(error => console.error('Error al actualizar el turno:', error));
      } else {
        /* Si no hay turno seleccionado, es un nuevo registro */
        this.turnoService.addTurno(this.turnoForm.value)
          .then(() => {
            console.log('Turno añadido exitosamente');
            this.turnoForm.reset();
          })
          .catch(error => console.error('Error al añadir el turno:', error));
      }
    }

    /* Método para rellenar el formulario con los datos existentes */
  llenarFormulario(turno: any): void {
      this.turnoSeleccionado = turno;  /* Guardar el turno actual para identificar si es edición */
      this.turnoForm.patchValue(turno);  /* Llenar el formulario con los datos del turno seleccionado */
    }

    // Método para iniciar el proceso de añadir un nuevo cliente
iniciarAgregarCliente() {
  this.turnoSeleccionado = null;
  this.turnoForm.reset();  // Opcional: Resetea el formulario
}

// Método para ver los detalles del cliente en el modal
verDetalles(turno: any) {
  this.clienteSeleccionado = turno;
}
}
