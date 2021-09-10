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
import { Alumno } from '../models/alumno';
import { AlumnoService} from '../services/alumno.service';
import { NotaModulo } from '../models/notaModulo';
import { NotaModuloService} from '../services/notaModulo.service';
import {ModuloNota} from '../models/ModuloNota';
@Component({
	selector: 'nota-modulo-add',
	templateUrl: '../views/notaModulo-add.html',
	providers: [UsuarioService, CursoService, AlumnoService, NotaModuloService, NotaMateriaService, ObservacionCursoService, MateriaService, ModuloService]

})

export class NotaModuloAddComponent implements OnInit{
	public titulo: string;
	public materia: Materia;
	public curso: Curso;
	public cursoActual: Curso;
	public cursete: Curso;
	public alumnos: Alumno[];
	public cursos: Curso[];
	public notaMateria: NotaMateria;
	public notasMaterias: NotaMateria[];
	public notaModulo: NotaModulo;
	public notasModulos: NotaModulo[];
	public modulo: Modulo;
	public observacionesCurso: ObservacionCurso[];
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public observacionCurso;
	public fechaInvalida: boolean;
	
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _materiaService: MateriaService,
		private _cursoService: CursoService,
		private _observacionCursoService: ObservacionCursoService,
		private _notaMateriaService: NotaMateriaService,
		private _alumnoService: AlumnoService,
		private _notaModuloService: NotaModuloService,
		private _moduloService: ModuloService,
		
		
	){
		this.titulo = 'Añadir nota:';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.curso = new Curso('','','','','','','');
		this.materia = new Materia('','','','','','','','','');
		this.notaModulo = new NotaModulo('','','','','','','','','','');
		this.fechaInvalida = false;
	}

	ngOnInit(){
		this.getAAlumnosPorCurso();

	}


	public onSubmit(){
			this._notaModuloService.saveNotaModulo(this.token, this.notaModulo).subscribe(
				response => {
					if(!response.notaModulo){
						this.alertMessage = 'Error en el servidor';
					}else{
						if(response.notaModulo){
							//console.log(this.notaModulo);
						}
						alert('La nota se ha creado correctamente');
						this._router.navigate(['/notas-modulo-por-curso', this.curso._id, this.modulo._id ]);
					}

				},
				error => {
					var errorMessage = <any>error;

			        if(errorMessage != null){
			          var body = JSON.parse(error._body);
			          this.alertMessage = body.message;

			          //console.log(error);
			        }
				}	
			);
	
	}
			
	getAAlumnosPorCurso(){
		this._route.params.forEach((params: Params) => {
			var cursoId = params['curso'];
			var moduloId= params['modulo'];
		
			this.getModulo(moduloId);
			this.notaModulo.curso=cursoId;
			this.notaModulo.modulo=moduloId;
			
			this._cursoService.getCurso(this.token, cursoId).subscribe(
				response =>{
					if(!response.curso){
						//console.log("el curso no existe");
						this._router.navigate(['/']);
					}else{
						this.curso = response.curso;
						
						this._alumnoService.getAlumnosPorCurso(this.token, this.curso._id).subscribe(
							response=>{
								if(!response.alumnos){
									//console.log("no devuelve alumnos");
									this._router.navigate(['/']);
								}else{
									this.alumnos = response.alumnos;
										
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
				},
				error =>{
					var errorMessage = <any>error;

					//////CUANDO SE VENCE LA SESION////////////////////////////					
					if (errorMessage.status==401 || errorMessage.status==403){
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
				}
				);

			this.notaModulo.modulo= this.modulo._id;
			this.notaModulo.curso=this.curso._id;
			
		});

	}

	logout(){
     localStorage.removeItem('identity');
     localStorage.removeItem('token');
     localStorage.clear();
     this.identity=null;
     this.token=null;
  	}
  	
  	
	getModulo(moduloId: string){
	this._moduloService.getModulo(this.token, moduloId).subscribe(
				response=>{
					if(!response.modulo){
						//console.log("no devuelve el modulo");
						this._router.navigate(['/']);
					}else{
						this.modulo = response.modulo;
				}},
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

	public onFecha_NotaChanged(value:Date){
    
    	var fecha = new Date();
    	let hoy = Date.now();
    	var fechaActual = new Date(hoy); 
    	var añoActual = fechaActual.getFullYear();
    	var mesActual = fechaActual.getMonth() + 1;
    	var diaActual = fechaActual.getDate();
    	
    	if (fecha=value){
    		let fechaElegida= fecha.toString();
    		let añoElegido = fechaElegida.substring(0,4);
    		let mesElegido = fechaElegida.substring(5,7);
    		let diaElegido = fechaElegida.substring(8,10);
    	
    		if (Number(añoElegido) == añoActual && Number(mesElegido) <= mesActual && Number(diaElegido) <= diaActual) {
    		
    		this.fechaInvalida=false;
    		//console.log("es válido");
    	}else{
    		this.fechaInvalida=true;
    		//console.log("Debe elegir una fecha válida");
    	}
    	}else{
    		this.fechaInvalida=true;
    		//console.log("no es válido");
    	}
    
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

