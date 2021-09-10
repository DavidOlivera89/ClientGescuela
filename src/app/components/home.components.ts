import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { Curso } from '../models/curso';
import { CursoService} from '../services/curso.service';
import { Alumno } from '../models/alumno';
import { AlumnoService} from '../services/alumno.service';
import { Docente } from '../models/docente';
import { DocenteService} from '../services/docente.service';

import { Materia } from '../models/materia';
import { MateriaService} from '../services/materia.service';

import { Modulo } from '../models/modulo';
import { ModuloService} from '../services/modulo.service';


@Component({
	selector: 'home',
	templateUrl: '../views/home.html',
	providers: [UsuarioService,CursoService, AlumnoService, UsuarioService, DocenteService, MateriaService],
})

export class HomeComponent implements OnInit{
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public curso1: Curso;
	public cursos2: Curso[];
	public alumno: Alumno;
	public docente: Docente;
	public alertMessage; 
	public materias: Materia[];
	public modulos: Modulo[];
		

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _cursoService: CursoService,
		private _alumnoService: AlumnoService,
		private _docenteService: DocenteService,
		private _materiaService: MateriaService,

		
	){
		this.titulo = 'Cursodsadas';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;

	}

	ngOnInit(){
		console.log('home.components.ts está cargado');

		this.getMisDatos();
		
	}



	getMisDatos(){

		if (this.identity.alumno==true) {
		
			this._alumnoService.getAlumno(this.token, this.identity._id).subscribe(
				response=>{
					if(!response.alumno){
						//this._router.navigate(['/']);
						//console.log("entro al no response alumno");
					}else{
						//		console.log("entro al si response alumno");
						this.alumno = response.alumno;
						this.materias = response.materias;
						this._router.navigate(['/alumno', response.alumno._id]);
						
					}	
				},
				error =>{
					var errorMessage = <any>error;
							///////////////////////CUANDO SE VENCE LA SESION////////////////////////////					
								if (errorMessage.status==401){
									alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
									this.logout();
									javascript:location.reload(true);
									
								}else{
					//				console.log("no entra al ig");
								}
							/////////////////////////CUANDO SE VENCE LA SESION///////////////////////////
					if(errorMessage != null){
						var body = JSON.parse(error.body);
						this.alertMessage = body.message;
					//	console.log(error);
					}
				}
				);

		}else{
			if (this.identity.alumno!==true){
				this._docenteService.getDocente(this.token, this.identity._id).subscribe(

					response=>{
						if(!response.docente){
					//		console.log("entro al no responde docente");
				
						
						}else{
					//		console.log("entro al si responde docente");
				

							this._router.navigate(['/docente', response.docente._id]);

						}	
					},
					error =>{
						var errorMessage = <any>error;
						///////////////////////CUANDO SE VENCE LA SESION////////////////////////////					
								if (errorMessage.status==401){
									alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
									this.logout();
									javascript:location.reload(true);
									
								}else{
					//				console.log("no entra al ig");
								}
						/////////////////////////CUANDO SE VENCE LA SESION///////////////////////////
						if(errorMessage != null){
							var status = error.status;
			
						}
					}
					);

			}
		}
	}


		logout(){
				localStorage.removeItem('identity');
				localStorage.removeItem('token');
				localStorage.clear();
				this.identity=null;
				this.token=null;
	
			}

		}

