import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { Curso } from '../models/curso';
import { CursoService} from '../services/curso.service';
import { AlumnoService} from '../services/alumno.service';
import {Alumno} from '../models/alumno';
import { Materia } from '../models/materia';
import { MateriaService} from '../services/materia.service';
import { Modulo } from '../models/modulo';
import { ModuloService} from '../services/modulo.service';


@Component({
	selector: 'curso-detail',
	templateUrl: '../views/curso-detail.html',
	providers: [UsuarioService, CursoService, AlumnoService, MateriaService, ModuloService]

})

export class CursoDetailComponent implements OnInit{
	public titulo: string;
	public curso: Curso;
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public alumnos: Alumno[];
	public materias: Materia[];
	public modulos: Modulo[];
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _cursoService: CursoService,
		private _alumnoService: AlumnoService,
		private _materiaService: MateriaService,

	){
		this.titulo = 'Actualizar curso';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.curso = new Curso('','','','','','','');
		
	}

	ngOnInit(){
		console.log('curso-edit.component.ts está cargado');
		//Llamar al metodo del api para sacar un curso;
		this.getCurso();
		
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

						this._alumnoService.getAlumnosPorCurso(this.token, this.curso._id).subscribe(
							response=>{
								if(!response.alumnos){
									this._router.navigate(['/']);
								}else{
									this.alumnos = response.alumnos;
									//console.log("estos sno los alumnos");
									//console.log(this.alumnos);

									this._materiaService.getMateriasYModulosPorCurso(this.token, this.curso).subscribe(
										response=>{
											if(!response.materias){
												//this._router.navigate(['/']);
											}else{
												this.materias = response.materias;
												this.modulos= response.modulos;

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
							},
							error =>{
								var errorMessage = <any>error;

								if(errorMessage != null){
									var body = JSON.parse(error.body);
									this.alertMessage = body.message;
								}
							});
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
	

	public confirmado;
	
	onDeleteConfirm(id){
		this.confirmado=id;
	}

	onCancelCurso(){
		this.confirmado=null;
	}

	onDeleteCurso(id){
		//console.log("Borrar el curso"+ id);
		this._cursoService.deleteCurso(this.token, id).subscribe(
			response =>{
					if(!response.curso){
						if(!response.message){
						alert('Error en el servidor');
						}else{
							alert(response.message);
						}
					}else{
						alert('El curso se ha eliminado correctamente');
					
						this._router.navigate(['/cursos/1']);
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
	}


	
}

