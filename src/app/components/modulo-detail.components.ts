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


@Component({
	selector: 'modulo-detail',
	templateUrl: '../views/modulo-detail.html',
	providers: [UsuarioService, MateriaService, CursoService, ModuloService]

})

export class ModuloDetailComponent implements OnInit{
	public titulo: string;
	public materia: Materia;
	public curso: Curso;
	public cursos: Curso[];
	public modulos: Modulo[];
	public modulo: Modulo;
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public materiaAcual;
	public otramateria;
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _materiaService: MateriaService,
		private _moduloService: ModuloService,
		private _cursoService: CursoService
	){
		this.titulo = 'Actualizar materia';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.curso = new Curso('','','','','','','');
		this.materia = new Materia('','','','','','','','','');
		this.modulo = new Modulo('','','','','','','','','','');
		
	}

	ngOnInit(){
		console.log('materia-edit.component.ts está cargado');

		this.getModulo();

	}

	getModulo(){

			this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._moduloService.getModulo(this.token, id).subscribe(
				response=>{
					if(!response.modulo){
						this._router.navigate(['/']);
					}else{
						this.modulo = response.modulo;
						this.materia = response.modulo.materia;

						this._cursoService.getCursosPorMateria(this.token, this.materia).subscribe(
								response =>{
									if(!response.cursos){
										console.log("no llegan");
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

						//				console.log(error);
									}
								}

								);
		

					}
						
				},
				error =>{
					var errorMessage = <any>error;
					//CUANDO SE VENCE LA SESION////////////////////////////					
					if (errorMessage.status==401 || errorMessage.status==403){
						alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
						this.logout();
						javascript:location.reload(true);

					}

					if(errorMessage != null){
						var body = JSON.parse(error.body);
						this.alertMessage = body.message;

				//		console.log(error);
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

	onCancelModulo(){
		this.confirmado=null;
	}

	onDeleteModulo(id){
		this._moduloService.deleteModulo(this.token, id).subscribe(
			response =>{
					if(!response.modulo){
						//alert('Error en el servidor');
						alert(response.message);
					}else{
						alert('El modulo se ha eliminado correctamente');
						this._router.navigate(['/docente, identity._id']);
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



	
}

