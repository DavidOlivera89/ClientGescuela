import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { Curso } from '../models/curso';
import { CursoService} from '../services/curso.service';
import {Materia } from '../models/materia';
import { MateriaService} from '../services/materia.service';

import { Docente } from '../models/docente';
import { DocenteService} from '../services/docente.service';

@Component({
	selector: 'materia-add',
	templateUrl: '../views/materia-add.html',
	providers: [UsuarioService,CursoService, MateriaService, DocenteService]

})

export class MateriaAddComponent implements OnInit{
	public titulo: string;
	public curso: Curso;
	public materia: Materia;
	public profesor: Docente;
	public profesores: Docente[];
	public profesor1Valor: string;
	public profesor2Valor: string;
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public datos;
	public profesor2Invalid: boolean;
	public anoActual;
	  public opcionSeleccionado: string  = '0'; // Iniciamos
	  public verSeleccion: string        = '';


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _cursoService: CursoService,
		private _materiaService: MateriaService,
		private _docenteService: DocenteService
	){
		this.titulo = 'Crear nueva materia';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.curso = new Curso('','','','','','','');
		this.profesor = new Docente('','','','','','','','','','',false,false,false,true,'');
    	this.datos = ['1','2','3','4','5'];
		this.materia = new Materia('','','','','','','','','');
		this.profesor2Invalid= false;
	}

	ngOnInit(){
		console.log('materia-add.component.ts está cargado');
	
		this.getProfesores();
		this.ObtenerAñoActual()

	}


	public onSubmit(){
		this.materia.ano_gregoriano=this.anoActual;
		this._materiaService.addMateria(this.token, this.materia).subscribe(
			response=>{
				if(!response.materia){
					this.alertMessage='Error en el servidor';

				}else{
					//La materia se ha creado correctamente';
					alert('El materia se ha creado correctamente');
					
					this.materia= response.materia;
					this._router.navigate(['/editar-materia', response.materia._id]);
					
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

	getProfesores(){
		this._docenteService.getTodosLosProfesores(this.token).subscribe(
			response =>{
				if(!response.profesores){
					this._router.navigate(['/']);
					//console.log("no se cargaron los profesores");
				}else{
					this.profesores = response.profesores;
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
		
	}


	logout(){
	     localStorage.removeItem('identity');
	     localStorage.removeItem('token');
	     localStorage.clear();
	     this.identity=null;
	     this.token=null;

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
    		//console.log("invalido")
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

