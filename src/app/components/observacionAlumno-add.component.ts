import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { Alumno } from '../models/alumno';
import { AlumnoService} from '../services/alumno.service';

import { Modulo } from '../models/modulo';
import { Materia } from '../models/materia';

import { ModuloService} from '../services/modulo.service';
import { MateriaService} from '../services/materia.service';

import { ObservacionAlumno } from '../models/observacionAlumno';
import { ObservacionAlumnoService} from '../services/observacionAlumno.service';



@Component({
	selector: 'observacionAlumno-add',
	templateUrl: '../views/observacionAlumno-add.html',
	providers: [UsuarioService, AlumnoService, ModuloService, ObservacionAlumnoService, MateriaService]

})

export class ObservacionAlumnoAddComponent implements OnInit{
	public titulo: string;
	public alumno: Alumno;
	public modulo: Modulo;
	public observacionAlumno: ObservacionAlumno;
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public datos;
	public materia;
		
	  public opcionSeleccionado: string  = '0'; // Iniciamos
	  public verSeleccion: string        = '';
	  	public esperados : Alumno[];
	  	public fechaInvalida: boolean;
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _alumnoService: AlumnoService,
		private _moduloService: ModuloService,
		private _observacionAlumnoService: ObservacionAlumnoService,

	){
		this.titulo = 'Crear nueva observación';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.alumno = new Alumno('','','','','','','','','','',false,false,false,true,'');
		this.datos = ['1','2','3','4','5'];
		this.modulo = new Modulo('','','','','','','','','','');
		this.materia= new Materia('','','','','','','','','');
		this.observacionAlumno= new ObservacionAlumno('','','','','','');
		this.fechaInvalida = false;

	}

	ngOnInit(){
		this.getAlumno();

	}
	
	public getAlumno(){
			this._route.params.forEach((params: Params) => {
			let alumno_id = params['alumno'];
		
			this._alumnoService.getAlumno(this.token, alumno_id).subscribe(
				response => {
					
					if(!response.alumno){
						
						//console.log('no llega alumno');
					}else{
						
						this.alumno=response.alumno;
					}

				},
				error => {
					var errorMessage = <any>error;

					//////////CUANDO SE VENCE LA SESION////////////////////////////					
					if (errorMessage.status==401 || errorMessage.status==403){
						////console.log()
						alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
						//this._router.navigate(['/']);
						this.logout();
						javascript:location.reload(true);

					}

			        if(errorMessage != null){
			          var body = JSON.parse(error._body);
			          this.alertMessage = body.message;

			          //console.log(error);
			        }
				});
		});
	}


	logout(){
	     localStorage.removeItem('identity');
	     localStorage.removeItem('token');
	     localStorage.clear();
	     this.identity=null;
	     this.token=null;
	  	}

	  	
	public onSubmit(){
		
		this._route.params.forEach((params: Params) => {
			let alumno_id = params['alumno'];
			
			this.observacionAlumno.docente_observador=this.identity._id;
			this.observacionAlumno.alumno_observado=alumno_id;
			// Cargo los datos ingresados para la observacion de Alumno
			this._observacionAlumnoService.addObservacionAlumno(this.token, this.observacionAlumno).subscribe(
				response => {
					
					if(!response.observacionAlumno){
						this.alertMessage = 'Error en el servidor';
					}else{
						//this.alertMessage = '¡La observacion se ha creado correctamente!';
						alert('La observacion se ha creado correctamente');
						
						this._router.navigate(['/observaciones-alumno', this.alumno._id]);
					}

				},
				error => {
					var errorMessage = <any>error;

			        if(errorMessage != null){
			          var body = JSON.parse(error._body);
			          this.alertMessage = body.message;

			        }
				}	
			);


		});
	}

	public onFecha_NotaChanged(value:Date){

    	var fecha = new Date();
    	let hoy = Date.now();
    	var fechaActual = new Date(hoy); 
    	var añoActual = fechaActual.getFullYear();
    	var mesActual = fechaActual.getMonth() + 1;
    	var diaActual = fechaActual.getDate();
    	
    	if (fecha=value){
    		let fechaElegida= fecha.toString();
    		let añoElegido = fechaElegida.substring(0,4);
    		let mesElegido = fechaElegida.substring(5,7);
    		let diaElegido = fechaElegida.substring(8,10);
    	
    		if (Number(añoElegido) == añoActual && Number(mesElegido) <= mesActual && Number(diaElegido) <= diaActual) {
    		
    		this.fechaInvalida=false;
    		//console.log("es válido");
    	}else{
    		this.fechaInvalida=true;
    		//console.log("Debe elegir una fecha válida");
    	}
    	}else{
    		this.fechaInvalida=true;
    		//console.log("no es válido");
    	}
    
	}
}


