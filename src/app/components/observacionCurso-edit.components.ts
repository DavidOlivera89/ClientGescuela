import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { Curso } from '../models/curso';
import { CursoService} from '../services/curso.service';

import { Alumno } from '../models/alumno';
import { AlumnoService} from '../services/alumno.service';
import { UploadService} from '../services/upload.service';
import { ObservacionAlumno } from '../models/observacionAlumno';
import { ObservacionAlumnoService} from '../services/observacionAlumno.service';
import { ObservacionCurso } from '../models/observacionCurso';
import { ObservacionCursoService} from '../services/observacionCurso.service';





@Component({
	selector: 'observacion-curso-edit',
	templateUrl: '../views/observacionCurso-edit.html',
	providers: [UsuarioService,CursoService, ObservacionCursoService, AlumnoService, UploadService, ObservacionAlumnoService]

})

export class ObservacionCursoEditComponent implements OnInit{
	public titulo: string;
	public curso: Curso;
	public alumno: Alumno;
	public cursos: Curso[];
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public is_edit;
	public dniInvalido;
	public fechaInvalida;
	public cursoAlumno;
	public cambiarClave;
	public nuevaclave;
	public reingresaclave;
	public clavesValidas;
	public observacionCurso;


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _cursoService: CursoService,
		private _alumnoService: AlumnoService,
		private _uploadService: UploadService,
		private _observacionAlumnoService: ObservacionAlumnoService,
		private _observacionCursoService: ObservacionCursoService,
		
	){
		this.titulo = 'Actualizar observación de curso';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.curso = new Curso('','','','','','','');
		this.alumno = new Alumno('','','','','','','','','','',false,false,false,true,'');
    	this.cambiarClave=false;
		this.is_edit = true;
		this.clavesValidas=true;
	}

	ngOnInit(){

		this.getAlumno();

	}

	getAlumno(){

		this._route.params.forEach((params: Params)=>{
			let id= params['id'];

			this._observacionCursoService.getObservacionCurso(this.token, id).subscribe(
				response=>{
					if(!response.observacion){
						//console.log("no vino la observacion");
						this._router.navigate(['/']);
					}else{
						this.observacionCurso = response.observacion;
						var mes = response.observacion.fecha.substring(3,5);
						//console.log("mes"+mes);
						var anio= response.observacion.fecha.substring(6,10);
						//console.log("anio"+anio);
						var dia= response.observacion.fecha.substring(0,2);
						//console.log("dia"+dia);
						
						this.observacionCurso.fecha= anio + '-'+mes+'-'+dia;
						//console.log(this.observacionCurso);

						this._cursoService.getCurso(this.token, response.observacion.curso_observado._id).subscribe(
							response=>{
								if(!response.curso){
									this._router.navigate(['/']);
								}else{
									this.curso = response.curso;

								}
							},
							error =>{
								var errorMessage = <any>error;

								if(errorMessage != null){
									var body = JSON.parse(error.body);
									this.alertMessage = body.message;

									//console.log(error);
								}
							});
						
					}
				},
				error =>{
					var errorMessage = <any>error;

					///////CUANDO SE VENCE LA SESION////////////////////////////					
					if (errorMessage.status==401 || errorMessage.status==403){
						////console.log()
						alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
						//this._router.navigate(['/']);
						this.logout();
						javascript:location.reload(true);

					}

					if(errorMessage != null){
						var body = JSON.parse(error.body);
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
		
		this._route.params.forEach((params: Params)=>{
			let id= params['id'];
			this._observacionCursoService.editObservacionCurso(this.token, id ,this.observacionCurso).subscribe(
				response=>{
					if(!response.observacionCurso){
						this.alertMessage='Error en el servidor';

					}else{
					
						alert('La observacion se ha actualizado correctamente');
						this._router.navigate(['/observaciones-curso', this.curso._id]);
		
					}
				},
				error =>{
					var errorMessage = <any>error;

					if(errorMessage != null){
						var body = JSON.parse(error.body);
						this.alertMessage = body.message;

						//console.log(error);
					}
				}
				);
		});
	}

	public confirmado;
	onDeleteConfirm(id){
		this.confirmado=id;
		//console.log(this.confirmado);
	}

	onCancelObservacion(){
		this.confirmado=null;
	}

	onDeleteObservacion(id){
		this._observacionCursoService.deleteObservacionCurso(this.token, id).subscribe(
			response =>{
					if(!response.observacion){
						alert('Error en el servidor');
						
					}else{
						alert('La observacion se ha eliminado correctamente');
						this._router.navigate(['/observaciones-curso', this.curso._id]);
					}
				},
				error =>{
					var errorMessage = <any>error;

					if(errorMessage != null){
						var body = JSON.parse(error.body);
						this.alertMessage = body.message;

						//console.log(error);
					}
				}
			);
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

