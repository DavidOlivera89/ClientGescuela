import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { Curso } from '../models/curso';
import { CursoService} from '../services/curso.service';

import { Alumno } from '../models/alumno';
import { AlumnoService} from '../services/alumno.service';
import { UploadService} from '../services/upload.service';


@Component({
	selector: 'alumno-edit',
	templateUrl: '../views/alumno-edit.html',
	providers: [UsuarioService,CursoService, AlumnoService, UploadService]

})

export class AlumnoEditComponent implements OnInit{
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


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _cursoService: CursoService,
		private _alumnoService: AlumnoService,
		private _uploadService: UploadService,
		
	){
		this.titulo = 'Actualizar alumno';
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
		console.log('alumno-edit.component.ts está cargado');
		//Llamar al metodo del api para sacar un curso;
		this.getAlumno();

		this.getCursos();
	}

	getAlumno(){

		this._route.params.forEach((params: Params)=>{
			let id= params['id'];

			this._alumnoService.getAlumno(this.token, id).subscribe(
				response=>{
					if(!response.alumno){
						this._router.navigate(['/']);
					}else{
						this.alumno = response.alumno;
						let mes = response.alumno.fecha_nacimiento.substring(3,5);
						let anio= response.alumno.fecha_nacimiento.substring(6,10);
						let dia= response.alumno.fecha_nacimiento.substring(0,2);
						
						this.alumno.fecha_nacimiento= anio + '-'+mes+'-'+dia;
						this.cursoAlumno= response.alumno.ultimoCurso;

					}
				},
				error =>{
					var errorMessage = <any>error;

					///////////////////////CUANDO SE VENCE LA SESION////////////////////////////					
					if (errorMessage.status==401 || errorMessage.status==403){
						alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
						this.logout();
						javascript:location.reload(true);

					}

					if(errorMessage != null){
						var body = JSON.parse(error.body);
						this.alertMessage = body.message;

						//console.log(error);
					}
				}

				);
		});
	}



	getCursos(){
		this._cursoService.getTodosLosCursos(this.token).subscribe(
			response =>{
				if(!response.cursos){
					this._router.navigate(['/']);
				}else{
					this.cursos = response.cursos;
				}

			},
			error =>{
				var errorMessage = <any>error;

				if(errorMessage != null){
					var body = JSON.parse(error.body);
					this.alertMessage = body.message;
				}
			}
			);
	}


	public onSubmit(){

		if (this.clavesValidas && this.cambiarClave){
			this.alumno.password=this.nuevaclave;
		}

		this._route.params.forEach((params: Params)=>{
			let id= params['id'];
			this._alumnoService.editAlumno(this.token, id ,this.alumno).subscribe(
				response=>{
					if(!response.alumno){
						this.alertMessage='Error en el servidor';

					}else{
						this.alertMessage= 'El alumno se ha actualizado correctamente';
						alert('El alumno se ha actualizado correctamente');
					
						if(!this.filesToUpload){
							// Redirigir
							this._router.navigate(['/alumno', response.alumno._id]);
						}else{
							// Subir la imagen del alumno
							this._uploadService.makeFileRequest(this.url+'upload-image-alumno/'+id, [], this.filesToUpload, this.token, 'image')
								.then(
									(result) => {
										this._router.navigate(['/alumno', response.alumno._id]);
									},
									(error) => {
										//console.log(error);
									}
								);
						}

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

	logout(){
     localStorage.removeItem('identity');
     localStorage.removeItem('token');
     localStorage.clear();
     this.identity=null;
     this.token=null;

  }

public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}


	public onDniChanged(value:string){
    	//this.docente.tutor = value;
    	//console.log(value);

    	if ((Number(value))&&(Number(value)>10000000)&&(Number(value)<99999999)){
    			this.dniInvalido = false;
    	}else{
    		//console.log("Es inválido");
    		this.dniInvalido = true;
    	}
	}
	
	public onFecha_NacimientoChanged(value:Date){
    	
    	var fecha = new Date();
    	let hoy = Date.now();
    	var fechaActual = new Date(hoy); 
    	var añoActual = fechaActual.getFullYear()
    	
    	if (fecha=value){
    		let fechaElegida= fecha.toString();
    		let añoElegido = fechaElegida.substring(0,4);
    		    	
    		if ((Number(añoElegido)< (añoActual)) && (Number(añoElegido)> (añoActual-70))){
    		
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

	setCambiarClave(){
		this.clavesValidas=false;
		if (this.cambiarClave==false){
			this.cambiarClave=true;
		}else{
			this.cambiarClave=false;

		}
	}

 	Cancelar(){
 		this.cambiarClave=false;

 	}
 	
 	public onPassChanged(value:string){
 		if (this.cambiarClave){
 			if(this.nuevaclave==this.reingresaclave){
 				this.clavesValidas=true;
 			}else{
 				this.clavesValidas=false;
 			}
 		
 		}
 	}

}

