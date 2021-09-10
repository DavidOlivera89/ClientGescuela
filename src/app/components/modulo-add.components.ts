import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
//import { CommonModule } from '@angular/common';


import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { Curso } from '../models/curso';
import { CursoService} from '../services/curso.service';

import { Modulo } from '../models/modulo';
import { Materia } from '../models/materia';
import { Docente } from '../models/docente';

import { ModuloService} from '../services/modulo.service';
import { MateriaService} from '../services/materia.service';
import { DocenteService} from '../services/docente.service';


@Component({
	selector: 'modulo-add',
	templateUrl: '../views/modulo-add.html',
	providers: [UsuarioService, CursoService, ModuloService, MateriaService, DocenteService]

})

export class ModuloAddComponent implements OnInit{
	public titulo: string;
	public curso: Curso;
	public modulo: Modulo;
	
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public datos;
	public materia;
		
	public opcionSeleccionado: string  = '0'; // Iniciamos
	public verSeleccion: string        = '';
  	public esperados : Curso[];
  	public page;
  	public id;
  	public profesores: Docente[];

  	public profesor1Valor;
	public profesor2Invalid: boolean;
	public profesor2Valor;
 	public anoActual;
	

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _cursoService: CursoService,
		private _moduloService: ModuloService,
		private _materiaService: MateriaService,
		private _docenteService: DocenteService,

	){
		this.titulo = 'Crear nuevo modulo';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.curso = new Curso('','','','','','','');
		this.datos = ['1','2','3','4','5'];
		this.modulo = new Modulo('','','','','','','','','','');
		this.materia= new Materia('','','','','','','','','');
		this.page=1;
		this.id="6014e9675bb3b65260fd151b";
	}

	ngOnInit(){
		console.log('modulo-add.component.ts está cargado');

		this.getMateriaModulo();
		this.getProfesores();

	}
	

	public getMateriaModulo(){
		this._route.params.forEach((params: Params) => {
			let materia_id = params['materia'];

			this._materiaService.getMateria(this.token, materia_id ).subscribe(
				response => {				
					if(!response.materia){
						//this.alertMessage = 'Error en el servidor';
				//		console.log("no hay materia");
					}else{
						this.materia = response.materia;
					}

				},
				error => {
					var errorMessage = <any>error;
					///////////CUANDO SE VENCE LA SESION////////////////////////////					
					if (errorMessage.status==401 || errorMessage.status==403){
						alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
						this.logout();
						javascript:location.reload(true);

					}

			        if(errorMessage != null){
			          var body = JSON.parse(error._body);
			          this.alertMessage = body.message;

			     //     console.log(error);
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

		this._route.params.forEach((params: Params) => {
			let materia_id = params['materia'];
			this.modulo.materia = materia_id;
			this._moduloService.addModulo(this.token, this.modulo).subscribe(
				response => {
					
					if(!response.modulo){
						this.alertMessage = 'Error en el servidor';
					}else{
						this.alertMessage = '¡El modulo se ha creado correctamente!';
						alert('El modulo se ha creado correctamente');
						
						this.modulo = response.modulo;
						
						this._router.navigate(['/editar-modulo', response.modulo._id]);
					}

				},
				error => {
					var errorMessage = <any>error;

			        if(errorMessage != null){
			          var body = JSON.parse(error._body);
			          this.alertMessage = body.message;

			//          console.log(error);
			        }
				}	
			);


		});
	}


	getProfesores(){
		this._docenteService.getTodosLosProfesores(this.token).subscribe(
			response =>{
				if(!response.profesores){
					this._router.navigate(['/']);
				//	console.log("no se cargaron los profesores");
				}else{
					this.profesores = response.profesores;
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
		
	}

	public onProfesor1Change(value:string){
  
    	this.profesor1Valor= value;

    	if(this.profesor1Valor!="" && this.profesor1Valor==this.profesor2Valor){
    		this.profesor2Invalid=true;
    	//	console.log("invalido");
    	}else{
    		this.profesor2Invalid=false;
    	}
	}

	public onProfesor2Change(value:string){
		//console.log(value);

		this.profesor2Valor= value;


    	if(this.profesor1Valor!="" && this.profesor1Valor==this.profesor2Valor){
    		this.profesor2Invalid=true;
    	//	console.log("invalido")
    	}else{
    		this.profesor2Invalid=false;
    	}
	}

	public ObtenerAñoActual(){
		let hoy = Date.now();
    	var fechaActual = new Date(hoy); 
    	this.anoActual = fechaActual.getFullYear();
    	//console.log(this.anoActual);
	}

}

