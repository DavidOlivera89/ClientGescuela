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


@Component({
	selector: 'notasMateria-list',
	templateUrl: '../views/notaMateria-list.html',
	providers: [UsuarioService, CursoService, ObservacionCursoService, MateriaService, NotaMateriaService, ModuloService]

})

export class NotaMateriaListComponent implements OnInit{
	public titulo: string;
	public materia: Materia;
	public curso: Curso;
	public cursos: Curso[];
	public notaMateria: NotaMateria;
	public notasMaterias: NotaMateria[];
	public observacionesCurso: ObservacionCurso[];
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public observacionCurso;
	
	
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
			let id = params['id'];

			this._materiaService.getMateria(this.token, id).subscribe(
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
									//console.log("no hay notas en este curso" + id);
								}else{
									this.notasMaterias = response.notas;
									//console.log("las notas materias son " + this.notasMaterias);
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

					//////CUANDO SE VENCE LA SESION////////////////////////////					
					if (errorMessage.status==401 || errorMessage.status==403){
						////console.log()
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
						//console.log("no llegan cursos");
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




 
}

