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
	selector: 'nota-modulo-edit',
	templateUrl: '../views/notaModulo-edit.html',
	providers: [UsuarioService, CursoService, AlumnoService, NotaModuloService, NotaMateriaService, ObservacionCursoService, MateriaService, ModuloService]

})

export class NotaModuloEditComponent implements OnInit{
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
	public nota;
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
		this.titulo = 'Editar nota:';
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
		this._route.params.forEach((params: Params)=>{
			var id= params['nota'];
			this._notaModuloService.editNotaModulo(this.token, id, this.nota).subscribe(
				response=>{
					if(!response.notaModulo){
						//this.alertMessage='Error en el servidor';

					}else{
						alert('La nota se ha actualizado correctamente');
						//this.alumno= response.alumno;
						this._router.navigate(['/notas-modulo-por-curso', response.notaModulo.curso, response.notaModulo.modulo]);
					
						
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
		});
	}


	getAAlumnosPorCurso(){
		this._route.params.forEach((params: Params) => {
			var notaModuloId = params['nota'];
	
			this._notaModuloService.getNotaModulo(this.token, notaModuloId).subscribe(
				response =>{
					if(!response.nota){
					}else{
						this.nota = response.nota;
						this.modulo = response.nota.modulo;
						this.cursete=response.nota.curso;
	
						let mes = response.nota.fecha.substring(3,5);
						let anio= response.nota.fecha.substring(6,10);
						let dia= response.nota.fecha.substring(0,2);
						
						this.nota.fecha= anio + '-'+mes+'-'+dia;
						this.notaModulo.modulo= this.modulo._id;
							
						this._materiaService.getMateria(this.token, this.modulo.materia).subscribe(
									response =>{
										if(!response.materia){
											//console.log("la materia no existe");
											//this._router.navigate(['/']);
										}else{
											this.materia = response.materia;
											//console.log("la materia es:");
											//console.log(this.materia);
											
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

					////CUANDO SE VENCE LA SESION////////////////////////////					
					if (errorMessage.status==401 || errorMessage.status==403){
						////console.log()
						alert("Su sesi??n ha expirado, por favor vuelva a iniciar sesi??n para continuar");
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
    	var a??oActual = fechaActual.getFullYear();
    	var mesActual = fechaActual.getMonth() + 1;
    	var diaActual = fechaActual.getDate();
    	
    	if (fecha=value){
    		let fechaElegida= fecha.toString();
    		let a??oElegido = fechaElegida.substring(0,4);
    		let mesElegido = fechaElegida.substring(5,7);
    		let diaElegido = fechaElegida.substring(8,10);

    		if (Number(a??oElegido) == a??oActual && Number(mesElegido) <= mesActual && Number(diaElegido) <= diaActual) {
    	
    		this.fechaInvalida=false;
    		//console.log("es v??lido");
    	}else{
    		this.fechaInvalida=true;
    		//console.log("Debe elegir una fecha v??lida");
    	}
    	}else{
    		this.fechaInvalida=true;
    		//console.log("no es v??lido");
    	}
    
	}

	public confirmado;
	onDeleteConfirm(id){
		this.confirmado=id;
	}

	onCancelNota(){
		this.confirmado=null;
	}

	onDeleteNota(id){
		this._notaModuloService.deleteNotaModulo(this.token, id).subscribe(
			response =>{
					if(!response.nota){
						alert('Error en el servidor');
						
					}else{
						alert('La nota se ha eliminado correctamente');
						this._router.navigate(['/notas-modulo-por-curso', response.nota.curso, response.nota.modulo]);
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

