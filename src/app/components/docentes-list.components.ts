import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { CursoService} from '../services/curso.service';
import { Curso } from '../models/curso';

import { Alumno } from '../models/alumno';
import { AlumnoService} from '../services/alumno.service';

import { Materia } from '../models/materia';
import { MateriaService} from '../services/materia.service';

import { Modulo } from '../models/modulo';
import { ModuloService} from '../services/modulo.service';

import { Docente } from '../models/docente';
import { DocenteService} from '../services/docente.service';

import { DocenteCursoMateriaBuscar} from '../models/docenteCursoMateriaBuscar';
import { AppComponent} from '../app.component';

@Component({
	selector: 'docentes-list',
	templateUrl: '../views/docentes-list.html',
	providers: [UsuarioService, CursoService, DocenteService, AlumnoService, MateriaService, ModuloService]

})

export class DocentesListComponent implements OnInit{
	public titulo: string;
	public cursos: Curso[];
	public alumnos: Alumno[];
	public docentes: Docente[];
	public docente:Docente;
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public next_page;
	public prev_page;
	public preceptores: Docente[];
	public tutores: Docente[];
	public profesores: Docente[];
	public docenteBuscar: DocenteCursoMateriaBuscar;
	public materias: Materia[];
	public modulos: Modulo[];
	public totalProfesores;
	public totalPreceptores;
	public totalTutores;
	public cantPaginas;
	public docentete: Docente;
	public pagina;
	public seBusco: boolean;


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _cursoService: CursoService,
		private _usuarioService: UsuarioService,
		private _alumnoService: AlumnoService,
		private _docenteService: DocenteService,
		private _materiaService: MateriaService,
		private _moduloService: ModuloService
	
	){
		this.titulo = 'Docentes';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.next_page=1;
		this.prev_page=1;
		this.docente = new Docente('','','','','','','','','','',true,true,true,false,'');
		this.docentete = new Docente('','','','','','','','','','',true,true,true,false,'');
		this.docenteBuscar= new DocenteCursoMateriaBuscar('','','','','');
		this.totalPreceptores, this.totalProfesores, this.totalTutores = 0;
		this.seBusco = false;

	}

	ngOnInit(){
			//Conseguir el listado de Docentes
		//this.getDocentes();

	}

	public onSubmit(){
		this.seBusco=true;
		var primeravez=true;
		var page;
		this.prev_page=1;
		this.next_page=1;
		this._route.params.forEach((params: Params)=>{
			if (primeravez){

				primeravez=false;
				this.pagina=1;
				page=1;
			}else{


				page = +params['page'];
				this.pagina=page;
			}

			if(!page){
				page=1;
				this.pagina=page;
			}else{
				this.next_page=page+1;
				this.prev_page=page-1;

				if(page == this.cantPaginas){
					this.next_page=page;
				}

				if(this.prev_page==0){
					this.prev_page=1;
				}
			}

			this._docenteService.getDocentesPorrBusqueda(this.token, this.docenteBuscar, page).subscribe(
				response =>{
					if(!response.profesores){
						//this._router.navigate(['/']);
						//		console.log("no llega nada");
					}else{
						//		console.log("entra al else");
						this.profesores= response.profesores;
						this.preceptores= response.preceptores;
						this.tutores= response.tutores;
						this.totalProfesores= response.totalProfesores;
						this.totalPreceptores= response.totalPreceptores;
						this.totalTutores= response.totalTutores;
						this.cantPaginas= response.cantPaginas;
					}

				},
				error =>{
					var errorMessage = <any>error;

					if (errorMessage.status==401 || errorMessage.status==403){
						//console.log()
						alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
						//this._router.navigate(['/']);
						this.logout();
						javascript:location.reload(true);
						
					}else{
						//	console.log("no entra al ig");
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


	getDocentes(){
		this._route.params.forEach((params: Params)=>{
			let page = +params['page'];
			this.pagina=page;
			if(!page){
				page=1;
				this.pagina=page;
			}else{
				this.next_page=page+1;
				this.prev_page=page-1;

				if(this.pagina == this.cantPaginas){
					this.next_page=this.pagina;
				}

				if(this.prev_page==0){
					this.prev_page=1;
				}
			}
			this._docenteService.getDocentesPorrBusqueda(this.token, this.docenteBuscar, page).subscribe(
				response =>{
					if(!response.profesores){
						//this._router.navigate(['/']);
						//		console.log("no llega nada");
					}else{
						//		console.log("entra al else");
						this.profesores= response.profesores;
						this.preceptores= response.preceptores;
						this.tutores= response.tutores;
						this.totalProfesores= response.totalProfesores;
						this.totalPreceptores= response.totalPreceptores;
						this.totalTutores= response.totalTutores;
						this.cantPaginas= response.cantPaginas;
					}

				},
				error =>{
					var errorMessage = <any>error;
					if (errorMessage.status==401 || errorMessage.status==403){
						//console.log()
						alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
						//this._router.navigate(['/']);
						this.logout();
						javascript:location.reload(true);
						
					}else{
						//console.log("no entra al ig");
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
						alert('Error en el servidor');
						
					}else{
						alert('El docente se ha eliminado correctamente');
						this.getDocentes();
					}
				},
				error =>{
					var errorMessage = <any>error;

					if(errorMessage != null){
						var body = JSON.parse(error.body);
						this.alertMessage = body.message;

			//			console.log(error);
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
}

