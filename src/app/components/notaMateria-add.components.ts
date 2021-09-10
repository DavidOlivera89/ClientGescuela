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

@Component({
	selector: 'nota-materia-add',
	templateUrl: '../views/notaMateria-add.html',
	providers: [UsuarioService, CursoService, AlumnoService,ObservacionCursoService, MateriaService, NotaMateriaService, ModuloService]

})

export class NotaMateriaAddComponent implements OnInit{
	public titulo: string;
	public materia: Materia;
	public curso: Curso;
	public cursoActual: Curso;
	public cursete: Curso;
	public alumnos: Alumno[];
	public cursos: Curso[];
	public notaMateria: NotaMateria;
	public notasMaterias: NotaMateria[];
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
		
	){
		this.titulo = 'Añadir nota:';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.curso = new Curso('','','','','','','');
		this.materia = new Materia('','','','','','','','','');
		this.observacionCurso= new ObservacionCurso('','','','','','');
		this.notaMateria = new NotaMateria('','','','','','','','','');
		this.fechaInvalida = false;
		
		}

	ngOnInit(){
	
		this.getAlumnosPorCurso();
	
	}


	public onSubmit(){
	
			this._notaMateriaService.saveNotaMateria(this.token, this.notaMateria).subscribe(
				response => {
					if(!response.notaMateria){
						this.alertMessage = 'Error en el servidor';
					}else{
					
						if(response.notaMateria){
					
						}
						alert('La nota se ha creado correctamente');
						
						
						this._router.navigate(['/notas-por-curso', this.curso._id, this.materia._id ]);

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
			
	getMateria(materiaId: string){
		this._materiaService.getMateria(this.token, materiaId).subscribe(
				response=>{
					if(!response.materia){
						//console.log("no devuelve la materia");
						this._router.navigate(['/']);
					}else{
						this.materia = response.materia;
						this.notaMateria.materia= this.materia._id;
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

	getAlumnosPorCurso(){
			this._route.params.forEach((params: Params) => {
			let cursoId = params['curso'];
			let materiaId= params['materia'];

			this.notaMateria.curso=cursoId;
			
			this._cursoService.getCurso(this.token, cursoId).subscribe(
				response =>{
					if(!response.curso){
						//console.log("el curso no llega");
						this._router.navigate(['/']);
					}else{
						this.curso = response.curso;
						
					}
				},
				error =>{
					var errorMessage = <any>error;

					///CUANDO SE VENCE LA SESION////////////////////////////					
					if (errorMessage.status==401 || errorMessage.status==403){
						alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
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
			this.getMateria(materiaId);
			this.notaMateria.materia= this.materia._id;

			this._alumnoService.getAlumnosPorCurso(this.token, cursoId).subscribe(
				response=>{
					if(!response.alumnos){
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
			});

	}


	logout(){
	     localStorage.removeItem('identity');
	     localStorage.removeItem('token');
	     localStorage.clear();
	     this.identity=null;
	     this.token=null;
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

