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


@Component({
	selector: 'docente-add',
	templateUrl: '../views/docente-add.html',
	providers: [UsuarioService, CursoService, AlumnoService, DocenteService]

})

export class DocenteAddComponent implements OnInit{
	public titulo: string;
	public curso: Curso;
	public alumno: Alumno;
	public docente: Docente;
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public dniInvalido;
	public fechaInvalida;
	public checkedValido: boolean;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _cursoService: CursoService,
		private _alumnoService: AlumnoService,
		private _docenteService: DocenteService
	){
		this.titulo = 'Crear nuevo docente';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.curso = new Curso('','','','','','','');
		this.alumno = new Alumno('','','','','','','','','','',false,false,false,true,'');
		this.docente = new Docente('','','','','','','','','','',false,false,false,false,'');
    	this.dniInvalido = false;
    	this.fechaInvalida = false;
	}

	ngOnInit(){
		console.log('docente-add.component.ts está cargado');
		

	}

	public onSubmit(){

		this._docenteService.addDocente(this.token, this.docente).subscribe(
			response=>{
				if(!response.docente){
					//'Error en el servidor';
					alert(response.message);

					this._router.navigate(['/crear-docente']);

				}else{
					//console.log("El docente se creo correctamente");
					alert('El docente se ha creado correctamente');
					this.docente= response.docente;

					this._router.navigate(['/editar-docente', response.docente._id]);
				}

				if(!this.filesToUpload){
						//redireccion
					}else{
						this.makeFileRequest(this.url+'uploadImageAlumno/'+this.docente._id, [], 
							this.filesToUpload).then((result:any)=>{
								
								this.docente.image = result.image;
								localStorage.setItem('identity', JSON.stringify(this.docente));
								
								let image_path = this.url+'getImageDocente/'+this.docente.image;

								document.getElementById('image-logged').setAttribute('src', image_path);
								//console.log(this.docente);
							});
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

	public filesToUpload: Array<File>;

	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
		//console.log(this.filesToUpload);
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


}

