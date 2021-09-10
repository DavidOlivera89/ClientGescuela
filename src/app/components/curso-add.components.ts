import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { Curso } from '../models/curso';
import { CursoService} from '../services/curso.service';
import { Docente } from '../models/docente';
import { DocenteService} from '../services/docente.service';


@Component({
	selector: 'curso-add',
	templateUrl: '../views/curso-add.html',
	providers: [UsuarioService,CursoService, DocenteService]

})

export class CursoAddComponent implements OnInit{
	public titulo: string;
	public curso: Curso;
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public datos;
	public tutores: Docente[];
	public preceptores: Docente[];
	public anoActual;
	public preceptor1Valor;
	public preceptor2Valor;
	public preceptor2Invalid: boolean;

	  public opcionSeleccionado: string  = '0'; // Iniciamos
	  public verSeleccion: string        = '';


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _cursoService: CursoService,
		private _docenteService: DocenteService,
		
	){
		this.titulo = 'Crear nuevo curso';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.curso = new Curso('','','','','','','');
		this.datos = ['1','2','3','4','5'];
		this.preceptor2Invalid= false;
	}

	ngOnInit(){
		console.log('curso-add.component.ts está cargado');
		//alert(this._cursoService.addCurso());
		this.getTutores();
		this.getPreceptores();
		this.ObtenerAñoActual();

	}

	

	public onSubmit(){
		this.curso.ano_gregoriano=this.anoActual;
		this._cursoService.addCurso(this.token, this.curso).subscribe(
			response=>{
				if(!response.curso){
					this.alertMessage='Error en el servidor';
					alert("El curso que se quiere crear ya se encuentra cargado en la base de datos "+response.ano+" "+response.division+" "+response.ano_gregoriano);
				}else{
					alert('El curso se ha creado correctamente');
					this.curso= response.curso;
					this._router.navigate(['/editar-curso', response.curso._id]);
				}
			},
			error =>{
				var errorMessage = <any>error;

				if(errorMessage != null){
					var body = JSON.parse(error.body);
					this.alertMessage = body.message;
				//	console.log(error);
				}
			});

	}

		getPreceptores(){
		this._docenteService.getTodosLosPreceptores(this.token).subscribe(
			response =>{
				if(!response.preceptores){
					this._router.navigate(['/']);
					//console.log("no se cargaron los preceptores");
				}else{
					this.preceptores = response.preceptores;
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

	getTutores(){
		this._docenteService.getTodosLosTutores(this.token).subscribe(
			response =>{
				if(!response.tutores){
					this._router.navigate(['/']);
					//console.log("no se cargaron los tutores");
				}else{
					this.tutores = response.tutores;
				}

			},
			error =>{
				var errorMessage = <any>error;
				///////////////////////CUANDO SE VENCE LA SESION////////////////////////////					
				if (errorMessage.status==401 || errorMessage.status==403){
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
			}

			);
		
	}


	logout(){
     localStorage.removeItem('identity');
     localStorage.removeItem('token');
     localStorage.clear();
     this.identity=null;
     this.token=null;
	 }


	public ObtenerAñoActual(){
		let hoy = Date.now();
    	var fechaActual = new Date(hoy); 
    	this.anoActual = fechaActual.getFullYear();

	}

	public onPreceptor1Change(value:string){
    	this.preceptor1Valor= value;

    	if(this.preceptor1Valor!="" && this.preceptor1Valor==this.preceptor2Valor){
    		this.preceptor2Invalid=true;
    		//console.log("invalido");
    	}else{
    		this.preceptor2Invalid=false;
    	}
	}

	public onPreceptor2Change(value:string){
		this.preceptor2Valor= value;

    	if(this.preceptor1Valor!="" && this.preceptor1Valor==this.preceptor2Valor){
    		this.preceptor2Invalid=true;
    		//console.log("invalido")
    	}else{
    		this.preceptor2Invalid=false;
    	}
	}
}

