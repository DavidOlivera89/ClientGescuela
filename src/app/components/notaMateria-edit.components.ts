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
	selector: 'nota-materia-edit',
	templateUrl: '../views/notaMateria-edit.html',
	providers: [UsuarioService, CursoService, AlumnoService,ObservacionCursoService, MateriaService, NotaMateriaService, ModuloService]

})

export class NotaMateriaEditComponent implements OnInit{
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
	public nota;
	
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
		this.titulo = 'Editar nota:';
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
		this._route.params.forEach((params: Params)=>{
			var id= params['nota'];
			this._notaMateriaService.editNotaMateria(this.token, id, this.nota).subscribe(
				response=>{
					if(!response.notaMateria){
						this.alertMessage='Error en el servidor';

					}else{
					
						alert('La nota se ha actualizado correctamente');
					
						this._router.navigate(['/notas-por-curso', response.notaMateria.curso, response.notaMateria.materia]);
						
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
			let notaMateriaId = params['nota'];
			
			this._notaMateriaService.getNotaMateria(this.token, notaMateriaId).subscribe(
				response =>{
					if(!response.nota){
						//this._router.navigate(['/']);
					}else{
						this.nota = response.nota;
						this.materia=response.nota.materia;
						this.cursete=response.nota.curso;

						let mes = response.nota.fecha.substring(3,5);
						let anio= response.nota.fecha.substring(6,10);
						let dia= response.nota.fecha.substring(0,2);
						
						this.nota.fecha= anio + '-'+mes+'-'+dia;

					}
				},
				error =>{
					var errorMessage = <any>error;
					////CUANDO SE VENCE LA SESION////////////////////////////					
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

			this.notaMateria.materia= this.materia._id;

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

	onCancelNota(){
		this.confirmado=null;
	}

	onDeleteNota(id){
		
		this._notaMateriaService.deleteNotaMateria(this.token, id).subscribe(
			response =>{
					if(!response.nota){
						alert('Error en el servidor');
						
					}else{
						alert('La nota se ha eliminado correctamente');
						
						this._router.navigate(['/notas-por-curso', response.nota.curso, response.nota.materia]);
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
}

