import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { CursoService} from '../services/curso.service';

import { Curso } from '../models/curso';
import { Alumno } from '../models/alumno';
import { AlumnoService} from '../services/alumno.service';

@Component({
	selector: 'alumno-list',
	templateUrl: '../views/alumnos-list.html',
	providers: [UsuarioService, CursoService, AlumnoService]

})

export class AlumnosListComponent implements OnInit{
	public titulo: string;
	public cursos: Curso[];
	public alumnos: Alumno[];
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public next_page;
	public prev_page;
	public alumno: Alumno;
	public total_items;
	public pagina;
	public cantPaginas;
	public seBusco: boolean;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _cursoService: CursoService,
		private _usuarioService: UsuarioService,
		private _alumnoService: AlumnoService
	){
		this.titulo = 'Alumnos';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.seBusco = false;
		this.next_page=1;
		this.prev_page=1;
		this.alumno= new Alumno('','','','','','','','','','',false,false,false,true,'');
	}

	ngOnInit(){
		console.log('alumnos-list.component.ts está cargado');
		
		//Conseguir el listado de Alumnos
		//this.getAlumnos();
		this.getCursos();
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

			this._alumnoService.getAlumnosPorrBusqueda(this.token,this.alumno,page).subscribe(
				response =>{
					if(!response.alumnos){
						//this._router.navigate(['/']);
					}else{
						this.alumnos = response.alumnos;
						this.total_items = response.total_items;
						this.cantPaginas = response.cantPaginas;
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
						//console.log("no entra al ig");
					}

					if(errorMessage != null){
						var body = JSON.parse(error.body);
						this.alertMessage = body.message;

					}
				}

				);
		});
}


	getAlumnos(){
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

			this._alumnoService.getAlumnosPorrBusqueda(this.token,this.alumno,page).subscribe(
				response =>{
					if(!response.alumnos){
						//this._router.navigate(['/']);
					}else{
						this.alumnos = response.alumnos;
						this.total_items = response.total_items;
						this.cantPaginas = response.cantPaginas;
					}

				},
				error =>{
					var errorMessage = <any>error;
					if (errorMessage.status==401 || errorMessage.status==403){
						//console.log()
						alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
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


	getCursos(){
		this._cursoService.getTodosLosCursos(this.token).subscribe(
			response =>{
				if(!response.cursos){
					//this._router.navigate(['/']);
					//console.log("no se cargaron los cursos");
				}else{
					this.cursos = response.cursos;
					//console.log(this.cursos);
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

	onCancelAlumno(){
		this.confirmado=null;
	}

	onDeleteAlumno(id){
		console.log("Borrar el alumno"+ id);
		this._alumnoService.deleteAlumno(this.token, id).subscribe(
			response =>{
					if(!response.alumno){
						alert('Error en el servidor');
						
					}else{
						alert('El alumno se ha eliminado correctamente');
						this.getAlumnos();
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


	 logout(){
	 console.log("entra al logout");
     localStorage.removeItem('identity');
     localStorage.removeItem('token');
     localStorage.clear();
     this.identity=null;
     this.token=null;
     console.log("cierra sesion");
 	 }


}

