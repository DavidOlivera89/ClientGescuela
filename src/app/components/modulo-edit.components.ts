import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { Curso } from '../models/curso';
import { CursoService} from '../services/curso.service';

import { Alumno } from '../models/alumno';
import { AlumnoService} from '../services/alumno.service';

import { Materia } from '../models/materia';
import { MateriaService} from '../services/materia.service';

import { Modulo } from '../models/modulo';
import { ModuloService} from '../services/modulo.service';
import { Docente } from '../models/docente';

import { DocenteService} from '../services/docente.service';


@Component({
	selector: 'modulo-edit',
	templateUrl: '../views/modulo-edit.html',
	providers: [UsuarioService,ModuloService, AlumnoService, MateriaService, DocenteService]

})

export class ModuloEditComponent implements OnInit{
	public titulo: string;
	public modulo: Modulo;
	public alumno: Alumno;
	public materia: Materia;
	
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public is_edit;
	public profesores: Docente[];
	public profesor1Valor: string;
	public profesor2Valor: string;
	public profesor2Invalid: boolean;


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _moduloService: ModuloService,
		private _alumnoService: AlumnoService,
		private _materiaService: MateriaService,

		private _docenteService: DocenteService,
		
	){
		this.titulo = 'Actualizar modulo';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.modulo = new Modulo('','','','','','','','','','');
		this.alumno = new Alumno('','','','','','','','','','',false,false,false,true,'');
    	this.materia = new Materia('','','','','','','','','');
		this.is_edit = true;
		this.profesor2Invalid= false;
		
	}

	ngOnInit(){
		console.log('alumno-edit.component.ts está cargado');
	
		this.getModulo();
		this.getProfesores();
	}

	getModulo(){

		this._route.params.forEach((params: Params)=>{
			let id= params['id'];

			this._moduloService.getModulo(this.token, id).subscribe(
				response=>{
					if(!response.modulo){
						this._router.navigate(['/']);
					}else{
						this.modulo = response.modulo;

						this.profesor1Valor= response.modulo.profesor1._id;
							if (response.modulo.profesor2){
								this.profesor2Valor = response.modulo.profesor2._id;
							}

					}
				},
				error =>{
					var errorMessage = <any>error;
					///////CUANDO SE VENCE LA SESION////////////////////////////					
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
		this.modulo.profesor1= this.profesor1Valor;
		this.modulo.profesor2= this.profesor2Valor;
	
		this._route.params.forEach((params: Params)=>{
			let id= params['id'];
			this._moduloService.editModulo(this.token, id ,this.modulo).subscribe(
				response=>{
					if(!response.modulo){
						this.alertMessage='Error en el servidor';
	
					}else{
						this.alertMessage= 'El modulo se ha actualizado correctamente';
						alert( 'El modulo se ha actualizado correctamente');
						this._router.navigate(['/modulo', response.modulo._id]);
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

				if(errorMessage != null){
					var body = JSON.parse(error.body);
					this.alertMessage = body.message;

					//console.log(error);
				}
			}

			);
		
	}

	
 	public onProfesor1Change(value:string){
    
    	this.profesor1Valor= value;

    	if(this.profesor1Valor!="" && this.profesor1Valor==this.profesor2Valor){
    		this.profesor2Invalid=true;
    		//console.log("invalido");
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
}

