import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { Curso } from '../models/curso';
import { CursoService} from '../services/curso.service';

import { Docente } from '../models/docente';
import { DocenteService} from '../services/docente.service';

@Component({
	selector: 'curso-edit',
	templateUrl: '../views/curso-edit.html',
	providers: [UsuarioService,CursoService, DocenteService]

})

export class CursoEditComponent implements OnInit{
	public titulo: string;
	public curso: Curso;
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public is_edit;
	public tutores: Docente[];
	public preceptores: Docente[];
	public preceptor1Valor: string;
	public preceptor2Valor: string;
	public preceptor2Invalid: boolean;
	public tutorValor: string;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _cursoService: CursoService,
		private _docenteService: DocenteService,
		
	){
		this.titulo = 'Actualizar curso';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.curso = new Curso('','','','','','','');
		this.is_edit = true;
		this.preceptor2Invalid= false;
	}

	ngOnInit(){
		console.log('curso-edit.component.ts está cargado');
		//Llamar al metodo del api para sacar un curso;
		this.getCurso();
		this.getTutores();
		this.getPreceptores();
	}

	getCurso(){

		this._route.params.forEach((params: Params)=>{
			let id= params['id'];

			this._cursoService.getCurso(this.token, id).subscribe(
				response=>{
					if(!response.curso){
						this._router.navigate(['/']);
					}else{
						this.curso = response.curso;

						this.tutorValor=response.curso.tutor._id;
						this.preceptor1Valor= response.curso.preceptor1._id;
						if (response.curso.preceptor2){
								this.preceptor2Valor = response.curso.preceptor2._id;
							}
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

	public onSubmit(){
		this.curso.preceptor1= this.preceptor1Valor;
		this.curso.preceptor2= this.preceptor2Valor;
		this.curso.tutor= this.tutorValor;

		this._route.params.forEach((params: Params)=>{
			let id= params['id'];
			this._cursoService.editCurso(this.token, id ,this.curso).subscribe(
				response=>{
					if(!response.curso){
						this.alertMessage='Error en el servidor';

					}else{
						//El curso se ha actualizado correctamente';
						alert('El curso se ha actualizado correctamente');
						this._router.navigate(['/curso', response.curso._id]);
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

				if(errorMessage != null){
					var body = JSON.parse(error.body);
					this.alertMessage = body.message;

					//console.log(error);
				}
			}

			);
		
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
		//console.log(value);

		this.preceptor2Valor= value;


    	if(this.preceptor1Valor!="" && this.preceptor1Valor==this.preceptor2Valor){
    		this.preceptor2Invalid=true;
    		//console.log("invalido")
    	}else{
    		this.preceptor2Invalid=false;
    	}
	}

	public onTutorChange(value:string){
		//console.log(value);

		this.tutorValor= value;
		//console.log(this.tutorValor);
	}

}

