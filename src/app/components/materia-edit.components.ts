import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { Curso } from '../models/curso';
import { CursoService} from '../services/curso.service';

import { Docente } from '../models/docente';
import { DocenteService} from '../services/docente.service';

import { Materia } from '../models/materia';
import { MateriaService} from '../services/materia.service';



@Component({
	selector: 'materia-edit',
	templateUrl: '../views/materia-edit.html',
	providers: [UsuarioService,CursoService, DocenteService, MateriaService]

})

export class MateriaEditComponent implements OnInit{
	public titulo: string;
	public curso: Curso;
	public materia: Materia;
	public docenteInit: string;
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
		private _cursoService: CursoService,
		private _docenteService: DocenteService,
		private _materiaService: MateriaService,
		
	){
		this.titulo = 'Actualizar materia';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;

		this.materia = new Materia('','','','','','','','','');
		this.is_edit = true;
		this.profesor2Invalid= false;
	}

	ngOnInit(){
		console.log('alumno-edit.component.ts está cargado');
	
		this.getMateria();
		this.getProfesores();

	
	}

	getMateria(){

		this._route.params.forEach((params: Params)=>{
			let id= params['id'];

			this._materiaService.getMateria(this.token, id).subscribe(
				response=>{
					if(!response.materia){
						this._router.navigate(['/']);
					}else{
						this.materia = response.materia;
						this.profesor1Valor= response.materia.profesor1._id;

							if (response.materia.profesor2){
								this.profesor2Valor = response.materia.profesor2._id;
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

		this.materia.profesor1= this.profesor1Valor;
		this.materia.profesor2= this.profesor2Valor;
	
		this._route.params.forEach((params: Params)=>{
			let id= params['id'];
			this._materiaService.editMateria(this.token, id ,this.materia).subscribe(
				response=>{
					if(!response.materia){
						this.alertMessage='Error en el servidor';
				//		console.log("no se pudo cargar la actualizacion");

					}else{
						this.alertMessage= 'La materia se ha actualizado correctamente';
						alert('La materia se ha actualizado correctamente');
	
						this._router.navigate(['/materia', response.materia._id]);
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
    		//console.log("invalido")
    	}else{
    		this.profesor2Invalid=false;
    	}
	}
}

