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
import { NotaModulo } from '../models/notaModulo';
import { Curso_Alumno } from '../models/curso_alumno';

import { NotaMateriaService} from '../services/notaMateria.service';
import { NotaModuloService} from '../services/notaModulo.service';


@Component({
	selector: 'notas-modulo-por-curso',
	templateUrl: '../views/notaModuloDeCursoList.html',
	providers: [UsuarioService, CursoService, ObservacionCursoService, MateriaService, NotaModuloService, ModuloService]

})

export class NotaModuloDeCursoListComponent implements OnInit{
	public titulo: string;
	public materia: Materia;
	public curso: Curso;
	public cursoActual: Curso;
	public alumnosCurso: Curso_Alumno[];
	
	public cursos: Curso[];
	public notaMateria: NotaMateria;
	public notasModulos: NotaModulo[];
	public notasModulosDeCurso:NotaModulo[];
	public notaModuloEnviar: NotaModulo;
	public modulo: Modulo;
	public observacionesCurso: ObservacionCurso[];
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public observacionCurso;
	public notasMateriaCurso: NotaMateria[];
	public notaMateriaCurso: NotaMateria;
	public notaModulo: NotaModulo;
	public notasFinalesModulos;
	public notasModulosRespaldo;
	public moduloProfesor1;
	public moduloProfesor2;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _materiaService: MateriaService,
		private _cursoService: CursoService,
		private _observacionCursoService: ObservacionCursoService,
		private _notaModuloService: NotaModuloService,
		private _moduloService: ModuloService
	){
		this.titulo = 'Notas de Modulo Del curso:';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.notaModuloEnviar=new NotaModulo('','','','','','','','','','');

		this.curso = new Curso('','','','','','','');
		this.materia = new Materia('','','','','','','','','');
		this.observacionCurso= new ObservacionCurso('','','','','','');
		this.notaMateria = new NotaMateria('','','','','','','','','');
		this.modulo = new Modulo('','','','','','','','','','');
		this.notaModulo = new NotaModulo('','','','','','','','','','');
		
	}

	ngOnInit(){
		
		this.getNotasMateria();
		this.getCursosPorModulo(this.modulo);

	}

	logout(){
     localStorage.removeItem('identity');
     localStorage.removeItem('token');
     localStorage.clear();
     this.identity=null;
     this.token=null;
     

  	}
  	
  	getNotasMateria(){

  		this._route.params.forEach((params: Params) => {
  			var cursoId = params['curso._id'];
  			var moduloId = params['modulo._id'];

  			this.getAlumnos_Curso(cursoId);

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
  					//////////CUANDO SE VENCE LA SESION////////////////////////////					
  					if (errorMessage.status==401 || errorMessage.status==403){
  						////console.log()
  						alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
  						this.logout();
  						javascript:location.reload(true);

  					}

  					if(errorMessage != null){
  						var body = JSON.parse(error.body);
  						this.alertMessage = body.message;
  						//console.log(error);
  					}
  				});


  			this._moduloService.getModulo(this.token, moduloId).subscribe(
  				response=>{
  					if(!response.modulo){
  						//console.log("no devuelve la modulo");
  						this._router.navigate(['/']);
  						////console.log("no devuelve el curso");
  					}else{
  						this.modulo = response.modulo;
  						this.moduloProfesor1=response.modulo.profesor1;
  						//console.log("profesor 1 ");
  						//console.log(this.moduloProfesor1);
  						if(response.modulo.profesor2){
  							this.moduloProfesor2=response.modulo.profesor2;
  						}
						this.getCursosPorModulo(this.modulo);

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
 			//console.log(moduloId);
  			this.notaModuloEnviar.modulo=moduloId;
  			this.notaModuloEnviar.curso=cursoId;

  			this._notaModuloService.getNotasModuloPorModuloCurso(this.token, this.notaModuloEnviar).subscribe(
  				response =>{
  					if(!response.notas){
  						//console.log("no llegan");
  						this._router.navigate(['/']);
  					}else{
  						this.notasModulos = response.notas;
  						this.notasFinalesModulos = response.notasFinales;
  						this.notasModulosRespaldo = response.notas;

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

  			this.getCurso(cursoId);

  		});
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


	getCursosPorModulo(modulo:Modulo){
			this._cursoService.getCursosPorModulo(this.token, modulo).subscribe(
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


	public confirmado;
	onDeleteConfirm(id){
		this.confirmado=id;
	}

	onCancelObservacion(){
		this.confirmado=null;
	}

	onDeleteObservacion(id){
		this._observacionCursoService.deleteObservacionCurso(this.token, id).subscribe(
			response =>{
					if(!response.observacionCurso){
						alert('Error en el servidor');
						
					}else{
						alert('La observacion se ha eliminado correctamente');
		
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

	public mostrarTodasLasNotas(){
		this.notasModulos=this.notasModulosRespaldo;
	}


	public mostrarNotasFinales(){
		this.notasModulos=this.notasFinalesModulos;
	}
	
}

