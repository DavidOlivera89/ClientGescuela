import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { Materia } from '../models/materia';
import { MateriaService} from '../services/materia.service';
import { Curso } from '../models/curso';
import { CursoService} from '../services/curso.service';
import { Modulo } from '../models/modulo';
import { ModuloService} from '../services/modulo.service';
import { ObservacionCurso } from '../models/observacionCurso';
import { ObservacionCursoService} from '../services/observacionCurso.service';
import { NotaMateria } from '../models/notaMateria';
import { NotaMateriaService} from '../services/notaMateria.service';
import { Curso_Alumno } from '../models/curso_alumno';



@Component({
	selector: 'notas-materia-curso',
	templateUrl: '../views/notas-materia-curso.html',
	providers: [UsuarioService, CursoService, ObservacionCursoService, MateriaService, NotaMateriaService, ModuloService]

})

export class NotasMateriaUnCurso implements OnInit{
	public titulo: string;
	public materia: Materia;
	public curso: Curso;
	public cursoActual: Curso;
	public alumnosCurso: Curso_Alumno[];
	public cursos: Curso[];
	public notaMateria: NotaMateria;
	public notasMaterias: NotaMateria[];
	public notasMateriasDeCurso:NotaMateria[];
	public notaMateriaEnviar: NotaMateria;
	public observacionesCurso: ObservacionCurso[];
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public observacionCurso;
	public notasMateriaCurso: NotaMateria[];
	public notaMateriaCurso: NotaMateria;
	
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _materiaService: MateriaService,
		private _cursoService: CursoService,
		private _observacionCursoService: ObservacionCursoService,
		private _notaMateriaService: NotaMateriaService,
	){
		this.titulo = 'Observaciones Del curso:';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.notaMateriaEnviar=new NotaMateria('','','','','','','','','');
		this.curso = new Curso('','','','','','','');
		this.materia = new Materia('','','','','','','','','');
		this.observacionCurso= new ObservacionCurso('','','','','','');
		this.notaMateria = new NotaMateria('','','','','','','','','');
	}

	ngOnInit(){
		this.getNotasMateria();
		this.getCursosPorMateria(this.materia);
	}

	
	getNotasMateria(){
		
		this._route.params.forEach((params: Params) => {
			let cursoId = params['curso._id'];
			let materiaId = params['materia._id'];

			this.getAlumnos_Curso(cursoId);

			this.getCurso(cursoId);
			

			this.notaMateriaEnviar.materia=materiaId;
			this.notaMateriaEnviar.curso=cursoId;


			this._notaMateriaService.getNotasMateriaPorMateriaCurso(this.token, this.notaMateriaEnviar).subscribe(
				response=>{
					if(!response.notas){
						//console.log("no llegan notas");
					}else{
						this.notasMateriaCurso= response.notas;
						//console.log(this.notasMateriaCurso);
					}	

				},
				error => {
					var errorMessage = <any>error;
					///////CUANDO SE VENCE LA SESION////////////////////////////					
					if (errorMessage.status==401 || errorMessage.status==403){
						////console.log()
						alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
						//this._router.navigate(['/']);
						this.logout();
						javascript:location.reload(true);

					}
					if(errorMessage != null){
						var body = JSON.parse(error._body);
						//this.alertMessage = body.message;

						//console.log(error);
					}
				});

			this._materiaService.getMateria(this.token, materiaId).subscribe(
				response=>{
					if(!response.materia){
						//console.log("no devuelve la materia");
						this._router.navigate(['/']);
					}else{
						this.materia = response.materia;
						
						this.getCursosPorMateria(this.materia);
						
						this.notaMateria = new NotaMateria('','','','','','',response.materia._i,'','');

						this._notaMateriaService.getNotasMateriaPorMateria(this.token, this.materia._id).subscribe(
							response=>{
								if(!response.notas){
									//this._router.navigate(['/']);
									//console.log("no hay notas en este curso" + cursoId);
								}else{
									this.notasMaterias = response.notas;

								}
							},
							error => {
								var errorMessage = <any>error;

								if(errorMessage != null){
									var body = JSON.parse(error._body);
									//console.log(error);
								}
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
		});
	}


	logout(){
	     localStorage.removeItem('identity');
	     localStorage.removeItem('token');
	     localStorage.clear();
	     this.identity=null;
	     this.token=null;
	  	}

	  	
	getCursosPorMateria(materia:Materia){
			this._cursoService.getCursosPorMateria(this.token, materia).subscribe(
				response =>{
					if(!response.cursos){
						//console.log("no llegan");
						this._router.navigate(['/']);
					}else{
						this.cursos = response.cursos;
					
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

	getCurso(cursoId: string){
		this._cursoService.getCurso(this.token, cursoId).subscribe(
				response =>{
					if(!response.curso){
						//console.log("el curso no existe");
						this._router.navigate(['/']);
					}else{
						this.cursoActual = response.curso;
						
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

	getAlumnos_Curso(cursoId: string){
	this._cursoService.getAlumnos_Curso(this.token, cursoId).subscribe(
			response =>{
				if(!response.alumnos){
					//console.log("no se encuentran alumnosCurso");
					//this._router.navigate(['/']);
				}else{
					this.alumnosCurso = response.alumnos;
					
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


	public confirmado;
	onDeleteConfirm(id){
		this.confirmado=id;
	}

	onCancelObservacion(){
		this.confirmado=null;
	}

	onDeleteObservacion(id){
		//console.log("Borrar la materia"+ id);
		this._observacionCursoService.deleteObservacionCurso(this.token, id).subscribe(
			response =>{
					if(!response.observacionCurso){
						alert('Error en el servidor');
						
					}else{
						alert('La observacion se ha eliminado correctamente');
		//				this.getObservacionesCursos();
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

	
}

