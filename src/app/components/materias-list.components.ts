import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { CursoService} from '../services/curso.service';
import { MateriaService} from '../services/materia.service';

import { Curso } from '../models/curso';
import { Materia } from '../models/materia';
import { Modulo } from '../models/modulo';
import { ModuloService} from '../services/modulo.service';


@Component({
	selector: 'materias-list',
	templateUrl: '../views/materia-list.html',
	providers: [UsuarioService, CursoService, MateriaService, ModuloService]

})

export class MateriasListComponent implements OnInit{
	public titulo: string;
	public cursos: Curso[];
	public materias: Materia[];
	public modulos: Modulo[];
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public next_page;
	public prev_page;
	public estaMateria:Materia;
	public totalMaterias;
	public totalModulos;
	public pagina;
	public cantPaginas;
	public materia: Materia;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _cursoService: CursoService,
		private _usuarioService: UsuarioService,
		private _materiaService: MateriaService,
		private _moduloService: ModuloService,
	){
		this.titulo = 'Materias y Modulos';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.next_page=1;
		this.prev_page=1;
		this.estaMateria= new Materia('','','','','','','','','',);
		this.materia= new Materia('','','','','','','','','',);

	}

	ngOnInit(){
		console.log('cursos-list.component.ts está cargado');
		
		//Conseguir el listado de materias y modulos
		this.getMateriasYModulos();

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

			this._materiaService.getMateriasYModulosPorrBusqueda(this.token, this.estaMateria, page).subscribe(
				response =>{
					if(!response.materias){
						//		console.log("no llegan las materias");
					}else{
						//		console.log("entra al else");
						this.modulos=response.modulos;
						this.materias = response.materias;
						this.totalMaterias = response.totalMaterias;
						this.totalModulos = response.totalModulos;
						this.cantPaginas = response.cantPaginas;
					}

				},
				error =>{
					var errorMessage = <any>error;


					//CUANDO SE VENCE LA SESION////////////////////////////					
					if (errorMessage.status==401 || errorMessage.status==403){
						alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
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


	getMateriasYModulos(){

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
					console.log("esta en next page > cant paginas");
				}

				if(this.prev_page==0){
					this.prev_page=1;
				}
			}

			this._materiaService.getMateriasYModulosPorrBusqueda(this.token, this.materia, page).subscribe(
				response =>{
					if(!response.materias){
						//this._router.navigate(['/']);
						//		console.log("no llegan materias");
					}else{
						//		console.log("entra al else");
						this.modulos=response.modulos;
						this.materias = response.materias;
						this.totalMaterias = response.totalMaterias;
						this.totalModulos = response.totalModulos;
						this.cantPaginas = response.cantPaginas;
					}

				},
				error =>{
					var errorMessage = <any>error;
					////CUANDO SE VENCE LA SESION////////////////////////////					
					if (errorMessage.status==401 || errorMessage.status==403){
						alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
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


	public confirmado;
	onDeleteConfirm(id){
		this.confirmado=id;
	}


	onCancelMateria(){
		this.confirmado=null;
	}


	onDeleteMateria(id){
		//console.log("Borrar la materia"+ id);
		this._materiaService.deleteMateria(this.token, id).subscribe(
			response =>{
					if(!response.materia){
						alert('Error en el servidor');
						
					}else{
						alert('El materia se ha eliminado correctamente');
						this.getMateriasYModulos();
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

	onCancelModulo(){
		this.confirmado=null;
	}

	
	onDeleteModulo(id){
		//console.log("Borrar el modulo"+ id);
		this._moduloService.deleteModulo(this.token, id).subscribe(
			response =>{
					if(!response.modulo){
						alert('Error en el servidor');
						
					}else{
						alert('El curso se ha eliminado correctamente');
						this.getMateriasYModulos();
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
     localStorage.removeItem('identity');
     localStorage.removeItem('token');
     localStorage.clear();
     this.identity=null;
     this.token=null;
	 }

 }

