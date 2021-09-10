import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { Curso } from '../models/curso';
import { CursoService} from '../services/curso.service';

import {MateriaService} from '../services/materia.service'
import { Materia } from '../models/materia';
import { Modulo } from '../models/modulo';

import { Docente } from '../models/docente';
import { DocenteService} from '../services/docente.service';



@Component({
	selector: 'docente-detail',
	templateUrl: '../views/docente-detail.html',
	providers: [UsuarioService, CursoService, DocenteService, MateriaService]

})

export class DocenteDetailComponent implements OnInit{
	public titulo: string;
	public curso: Curso;
	public docente: Docente;
	public docentete;
	public materias: Materia[];
	public cursosPreceptor: Curso[];
	public cursosTutor: Curso[];
	public modulos:Modulo[];
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public roles;
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _cursoService: CursoService,
		private _materiaService: MateriaService,

		private _docenteService: DocenteService
	){
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.curso = new Curso('','','','','','','');
		this.roles="";
	}

	ngOnInit(){
		console.log('docente-detail.component.ts está cargado');
		
		this.getDocente();

	}

	getDocente(){

		this._route.params.forEach((params: Params)=>{
			let id= params['id'];
			this._docenteService.getDocente(this.token, id).subscribe(
				response=>{
					if(!response.docente){
						//this._router.navigate(['/']);
					}else{
						this.docente = response.docente;
						this.docentete = this.docente;
						
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

						this._docenteService.getMateriasModulosCursosDeDocente(this.token, this.docente).subscribe(
							response=>{

									this.materias = response.materiasEncontradas;
									this.cursosPreceptor= response.cursosEncontradosPreceptor;
									this.modulos = response.modulosEncontrados;
									this.cursosTutor= response.cursosEncontradosTutor;

							},
							error =>{
								var errorMessage = <any>error;

								///////////////////////CUANDO SE VENCE LA SESION////////////////////////////					
									if (errorMessage.status==401 || errorMessage.status==403){
										alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
										this.logout();
										javascript:location.reload(true);

									}else{
							//			console.log("no entra al ig");
									}
								if(errorMessage != null){
									var body = JSON.parse(error.body);
									this.alertMessage = body.message;

								}
							}

							);




					}
				},
				error =>{
					var errorMessage = <any>error;
					///////////////////////CUANDO SE VENCE LA SESION////////////////////////////					
									if (errorMessage.status==401 || errorMessage.status==403){
										alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
										this.logout();
										javascript:location.reload(true);
									}else{
							//			console.log("no entra al ig");
									}

					if(errorMessage != null){
						var body = JSON.parse(error.body);
						this.alertMessage = body.message;

					}
				}

				);
		});


	}


	mostrarMateriasModulosCursosDeDocente(){
		this._docenteService.getMateriasModulosCursosDeDocente(this.token, this.docente).subscribe(
				response=>{
					if(!response.docente){
						//this._router.navigate(['/']);
					}else{
						//this.docente = response.docente;
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

	logout(){
     localStorage.removeItem('identity');
     localStorage.removeItem('token');
     localStorage.clear();
     this.identity=null;
     this.token=null;
     this._router.navigate(['/']);
  }

  public confirmado;
	onDeleteConfirm(id){
		this.confirmado=id;
	}

	onCancelDocente(){
		this.confirmado=null;
		
	}

	onDeleteDocente(id){

		this._docenteService.deleteDocente(this.token, id).subscribe(
			response =>{
					if(!response.docente){
						//alert('Error en el servidor');
						alert(response.message);
					}else{
						alert('El docente se ha eliminado correctamente');
						this._router.navigate(['/docentes/1']);
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

	
}

