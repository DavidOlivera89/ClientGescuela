import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { Curso } from '../models/curso';
import { CursoService} from '../services/curso.service';

import { Alumno } from '../models/alumno';
import { AlumnoService} from '../services/alumno.service';

import { Docente } from '../models/docente';
import { DocenteService} from '../services/docente.service';

import { UploadService} from '../services/upload.service';

@Component({
	selector: 'docente-edit',
	templateUrl: '../views/docente-edit.html',
	providers: [UsuarioService,CursoService, AlumnoService, DocenteService, UploadService]

})

export class DocenteEditComponent implements OnInit{
	public titulo: string;
	public curso: Curso;
	public alumno: Alumno;
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public is_edit;
	public docente;
	public checkedValido: boolean;
	public fechaInvalida;
	public dniInvalido;
	public cambiarClave;
	public nuevaclave;
	public reingresaclave;
	public clavesValidas;
	public roles;
	




	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _cursoService: CursoService,
		private _alumnoService: AlumnoService,
		private _docenteService: DocenteService,
		private _uploadService: UploadService,
		
	){
		this.titulo = 'Actualizar docente';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.curso = new Curso('','','','','','','');
		this.alumno = new Alumno('','','','','','','','','','',false,false,false,true,'');
		this.docente= new Docente('','','','','','','','','','',false,false,false,true,'');
    	this.checkedValido=true;
		this.is_edit = true;
		this.fechaInvalida = false;
		this.dniInvalido = false;
		this.cambiarClave=false;
		this.clavesValidas=true;
		this.roles="";

	}

	ngOnInit(){
		console.log('docente-edit.component.ts está cargado');
		this.getDocente();

	}

	getDocente(){

		this._route.params.forEach((params: Params)=>{
			let id= params['id'];

			this._docenteService.getDocente(this.token, id).subscribe(
				response=>{
					if(!response.docente){
						this._router.navigate(['/']);
					}else{
						this.docente = response.docente;

						let mes = response.docente.fecha_nacimiento.substring(3,5);
						let anio= response.docente.fecha_nacimiento.substring(6,10);
						let dia= response.docente.fecha_nacimiento.substring(0,2);
						
						this.docente.fecha_nacimiento= anio + '-'+mes+'-'+dia;

						if(response.docente.preceptor==true){
							this.roles=this.roles+"Preceptor";
						}
						
						if(response.docente.tutor==true){
							if(this.roles!=""){
							this.roles=this.roles+" / Tutor";
							}else{
								this.roles="Tutor";
							}
						}
						
						if(response.docente.profesor==true){
							if(this.roles!=""){
							this.roles=this.roles+" / Profesor";
							}else{
								this.roles="Profesor";
							}
						}
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

					//	console.log(error);
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

	  
	public onSubmit(){
		console.log(this.docente);

		if (this.clavesValidas && this.cambiarClave){
			this.docente.password=this.nuevaclave;
		}

		this._route.params.forEach((params: Params)=>{
			let id= params['id'];
			this._docenteService.editDocente(this.token, id ,this.docente).subscribe(
				response=>{
					if(!response.docente){
						this.alertMessage='Error en el servidor';
						alert(response.message);

					}else{
						this.alertMessage= 'El docente se ha actualizado correctamente';
						alert('El docente se ha actualizado correctamente');
						if(!this.filesToUpload){
							this._router.navigate(['/docente', response.docente._id ]);
						}else{
							//Subir la imagen del docente
							this._uploadService.makeFileRequest(this.url+'upload-image-docente/'+id, [], this.filesToUpload, this.token, 'image')
								.then(
									(result) => {
										this._router.navigate(['/docente', response.docente._id]);
									},
									(error) => {
								//		console.log(error);
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

					//	console.log(error);
					}
				}
				);
		});
	}



	public filesToUpload: Array<File>;

	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
		//console.log(this.filesToUpload);
	}

	

 	public esTutor:boolean;
	public esProfesor:boolean;
	public esPreceptor:boolean;

	public onEsTutorChanged(value:boolean){
    	this.docente.tutor = value;
    	this.checkedValidar();
	}
	public onEsProfesorChanged(value:boolean){
    	this.docente.profesor = value;
    	this.checkedValidar();
	}
	public onEsPreceptorChanged(value:boolean){
    	this.docente.preceptor = value;
    	this.checkedValidar();
	}

	public checkedValidar(){
		if (this.docente.tutor==false && this.docente.profesor==false && this.docente.preceptor==false){
			this.checkedValido=false;
		}else{ this.checkedValido=true}
		//console.log(this.checkedValido);
	}

	public onDniChanged(value:string){
    	console.log(value);


    	if ((Number(value))&&(Number(value)>10000000)&&(Number(value)<99999999)){
    			this.dniInvalido = false;
    	}else{
    		//console.log("Es inválido");
    		this.dniInvalido = true;
    	}
	}

	public onFecha_NacimientoChanged(value:Date){
    	console.log(value);

    	var fecha = new Date();
    	let hoy = Date.now();
    	var fechaActual = new Date(hoy); 
    	var añoActual = fechaActual.getFullYear()
    
    	if (fecha=value){
    		let fechaElegida= fecha.toString();
    		let añoElegido = fechaElegida.substring(0,4);
    	
    		if ((Number(añoElegido)< (añoActual)) && (Number(añoElegido)> (añoActual-70))){
    		console.log(añoElegido+' < '+(añoActual));
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

	public setCambiarClave(){
		this.clavesValidas=false;
		if (this.cambiarClave==false){
			this.cambiarClave=true;
		}else{
			this.cambiarClave=false;

		}
		//console.log(this.cambiarClave);
	}

 	public Cancelar(){
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

