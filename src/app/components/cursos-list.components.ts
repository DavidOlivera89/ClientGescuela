import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { CursoService} from '../services/curso.service';

import { Curso } from '../models/curso';

@Component({
	selector: 'cursos-list',
	templateUrl: '../views/cursos-list.html',
	providers: [UsuarioService, CursoService]

})

export class CursosListComponent implements OnInit{
	public titulo: string;
	public cursos: Curso[];
	public esteCurso: Curso;
	public curso: Curso;
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public next_page;
	public prev_page;
	public total_items;
	public cantPaginas;
	public pagina;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _cursoService: CursoService,
		private _usuarioService: UsuarioService
	){
		this.titulo = 'Cursos';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.next_page=1;
		this.prev_page=1;
		this.esteCurso= new Curso('','','','','','','');
		this.curso= new Curso('','','','','','','');

	}

	ngOnInit(){
		console.log('cursos-list.component.ts está cargado');	
		//Conseguir el listado de Cursos
		this.getCursos();

	}

	public onSubmit(){
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

			this._cursoService.getCursosPorrBusqueda(this.token,this.esteCurso,page).subscribe(
				response =>{
					if(!response.cursos){
						//this._router.navigate(['/']);
					}else{
						this.cursos = response.cursos;
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
/////////////////////////CUANDO SE VENCE LA SESION///////////////////////////
					if(errorMessage != null){
						var body = JSON.parse(error.body);
						this.alertMessage = body.message;
					}
				}

				);
		});

	}


	getCursos(){
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

			this._cursoService.getCursosPorrBusqueda(this.token,this.curso,page).subscribe(
				response =>{
					if(!response.cursos){
						//this._router.navigate(['/']);
					}else{
						this.cursos = response.cursos;
						this.total_items = response.total_items;
						this.cantPaginas = response.cantPaginas;
					}

				},
				error =>{
					var errorMessage = <any>error;

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


	public confirmado;
	onDeleteConfirm(id){
		this.confirmado=id;
	}

	onCancelCurso(){
		this.confirmado=null;
	}

	onDeleteCurso(id){
		this._cursoService.deleteCurso(this.token, id).subscribe(
			response =>{
					if(!response.curso){
						alert('Error en el servidor');
						
					}else{
						alert('El curso se ha eliminado correctamente');
						this.getCursos();
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

 logout(){
    localStorage.removeItem('identity');
     localStorage.removeItem('token');
     localStorage.clear();
     this.identity=null;
     this.token=null;
 	 }	 


}

