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
	selector: 'alumno-add',
	templateUrl: '../views/alumno-add.html',
	providers: [UsuarioService, CursoService, AlumnoService, UploadService]

})

export class AlumnoAddComponent implements OnInit{
	public titulo: string;
	public curso: Curso;
	public alumno: Alumno;
	public cursos: Curso[];
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public linea: String;
	public dniInvalido: boolean;
	public fechaInvalida: boolean;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _cursoService: CursoService,
		private _alumnoService: AlumnoService,
		private _uploadService: UploadService
	){
		this.titulo = 'Crear nuevo alumno';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.curso = new Curso('','','','','','','');
		this.alumno = new Alumno('','','','','','','','','','',false,false,false,true,'');
    	this.linea = "";
    	this.dniInvalido = false;
    	this.fechaInvalida = false;
	}

	ngOnInit(){
		console.log('alumno-add.component.ts está cargado');
		//alert(this._cursoService.addCurso());
	this.getCursos();

	}

	public onSubmit(){


		console.log(this.alumno);
		this._alumnoService.addAlumno(this.token, this.alumno).subscribe(
			response=>{
				if(!response.alumno){
					alert(response.message);

					this._router.navigate(['/crear-alumno']);
					
				}else{
					alert('El alumno se ha creado correctamente');
					this.alumno= response.alumno;

					this._router.navigate(['/editar-alumno', this.alumno._id]);
					//this.alertMessage='Error en el servidor';
				}

			},
			error =>{
				var errorMessage = <any>error;

				if(errorMessage != null){
					var body = JSON.parse(error.body);
					this.alertMessage = body.message;

				}
			});

	}

	getCursos(){
		this._cursoService.getTodosLosCursos(this.token).subscribe(
			response =>{
				if(!response.cursos){
					this._router.navigate(['/']);
	//				console.log("no se cargaron los cursos");
				}else{
					this.cursos = response.cursos;
				}
			},
			error =>{
				var errorMessage = <any>error;
				///////////////////////CUANDO SE VENCE LA SESION////////////////////////////					
					if (errorMessage.status==401 || errorMessage.status==403){
						//console.log()
						alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
						//this._router.navigate(['/']);
						this.logout();
						javascript:location.reload(true);

					}
				if(errorMessage != null){
					var body = JSON.parse(error.body);
					this.alertMessage = body.message;
					console.log(error);
				}
			}
			);
	}

		logout(){
     localStorage.removeItem('identity');
     localStorage.removeItem('token');
     localStorage.clear();
     this.identity=null;
     this.token=null;
     //this._router.navigate(['/docente']);

  }
	public onDniChanged(value:string){
    	//this.docente.tutor = value;
//    	console.log(value);

    	if ((Number(value))&&(Number(value)>10000000)&&(Number(value)<99999999)){
 //   			console.log("es mayor a 10.000.000 y menor de 99999999")
    			this.dniInvalido = false;
    	}else{
 //   		console.log("Es inválido");
    		this.dniInvalido = true;
    	}
	}
	
	public onFecha_NacimientoChanged(value:Date){
    	//this.docente.tutor = value;
    	console.log(value);

    	var fecha = new Date();
    	let hoy = Date.now();
    	var fechaActual = new Date(hoy); 
    	var añoActual = fechaActual.getFullYear();

    	if (fecha=value){
    		let fechaElegida= fecha.toString();
    		let añoElegido = fechaElegida.substring(0,4);   	
    		if ((Number(añoElegido)< (añoActual)) && (Number(añoElegido)> (añoActual-70))){
    		this.fechaInvalida=false;
    	}else{
    		this.fechaInvalida=true;
    	}
    	}else{
    		this.fechaInvalida=true;
    	}
    
	}



	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}


	
	makeFileRequest(url: string, params: Array<string>, files: Array<File>){
		var token = this.token;

		return new Promise(function(resolve, reject){
			var formData: any = new FormData();
			var xhr = new XMLHttpRequest();

			for (var i = 0; i < files.length; i++) {
				formData.append('image', files[i], files[i].name);

			}

			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if (xhr.status==200) {
						resolve(JSON.parse(xhr.response));
	
					}else{
						reject(xhr.response);
					}
				

				}
			}	

			xhr.open('POST',url, true);
			xhr.setRequestHeader('Authorization', token);
			xhr.send(formData);

		});
 	}
}

