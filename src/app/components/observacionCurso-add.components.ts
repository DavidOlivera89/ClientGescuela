import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { Curso } from '../models/curso';
import { CursoService} from '../services/curso.service';

import { Modulo } from '../models/modulo';
import { Materia } from '../models/materia';

import { ModuloService} from '../services/modulo.service';
import { MateriaService} from '../services/materia.service';

import { ObservacionCurso } from '../models/observacionCurso';
import { ObservacionCursoService} from '../services/observacionCurso.service';



@Component({
	selector: 'observacionCurso-add',
	templateUrl: '../views/observacionCurso-add.html',
	providers: [UsuarioService, CursoService, ModuloService, ObservacionCursoService, MateriaService]

})

export class ObservacionCursoAddComponent implements OnInit{
	public titulo: string;
	public curso: Curso;
	public modulo: Modulo;
	public observacionCurso: ObservacionCurso;
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public datos;
	public materia;
		
	  public opcionSeleccionado: string  = '0'; // Iniciamos
	  public verSeleccion: string        = '';
	  	public esperados : Curso[];
	  	public date;
	  	public id;
	  	public dia;
	  	public mes;
	  	public ano;
	  	public hora;
	  	public fecha;
	  	public fechaInvalida: boolean;



		

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _cursoService: CursoService,
		private _moduloService: ModuloService,
		private _observacionCursoService: ObservacionCursoService,

	){
		this.titulo = 'Crear nueva observación';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.curso = new Curso('','','','','','','');
		this.datos = ['1','2','3','4','5'];
		this.modulo = new Modulo('','','','','','','','','','');
		this.materia= new Materia('','','','','','','','','');
		this.observacionCurso= new ObservacionCurso('','','','','','');
		this.fechaInvalida = false;
		
	  		}

	ngOnInit(){
		console.log('observacion curso-add.component.ts está cargado');
		this.getCurso();

	}
	
	public getCurso(){
			this._route.params.forEach((params: Params) => {
			let curso_id = params['curso'];
		
			this._cursoService.getCurso(this.token, curso_id).subscribe(
				response => {
					
					if(!response.curso){
						//this.alertMessage = 'Error en el servidor';
					}else{
						this.curso=response.curso;
					}

				},
				error => {
					var errorMessage = <any>error;
					/////////////CUANDO SE VENCE LA SESION////////////////////////////					
					if (errorMessage.status==401 || errorMessage.status==403){
						////console.log()
						alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
						this.logout();
						javascript:location.reload(true);

					}

			        if(errorMessage != null){
			          var body = JSON.parse(error._body);
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
	  	
	public onSubmit(){
		
		this._route.params.forEach((params: Params) => {
			let curso_id = params['curso'];
	
			this.observacionCurso.docente_observador=this.identity._id;
			this.observacionCurso.curso_observado=curso_id;
			// Cargo los datos ingresados para la observacion de Curso
			this._observacionCursoService.addObservacionCurso(this.token, this.observacionCurso).subscribe(
				response => {
					
					if(!response.observacionCurso){
						this.alertMessage = 'Error en el servidor';
					}else{
						alert('La observacion se ha creado correctamente');
						
						
						this._router.navigate(['/observaciones-curso', this.curso._id]);
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


		});
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

}


