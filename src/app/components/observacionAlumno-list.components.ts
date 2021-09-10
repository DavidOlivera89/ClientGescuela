import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { Materia } from '../models/materia';
import { MateriaService} from '../services/materia.service';
import { Alumno } from '../models/alumno';
import { AlumnoService} from '../services/alumno.service';
import { Modulo } from '../models/modulo';
import { ModuloService} from '../services/modulo.service';
import { ObservacionAlumno } from '../models/observacionAlumno';
import { ObservacionAlumnoService} from '../services/observacionAlumno.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
	selector: 'observacionesAlumno-list',
	templateUrl: '../views/observacionesAlumno-list.html',
	providers: [UsuarioService, AlumnoService, ObservacionAlumnoService, ModuloService]

})

export class ObservacionAlumnoListComponent implements OnInit{
	public titulo: string;
	public alumno: Alumno;
	public observacionesAlumno: ObservacionAlumno[];
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public observacionAlumno;
	
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _alumnoService: AlumnoService,
		private _observacionAlumnoService: ObservacionAlumnoService,
	){
		this.titulo = 'Observaciones Del alumno:';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
	    this.alumno = new Alumno('','','','','','','','','','',false,false,false,true,'');
		this.observacionAlumno= new ObservacionAlumno('','','','','','');
	}

	ngOnInit(){
		this.getObservacionesAlumno();
	}

	getObservacionesAlumno(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._alumnoService.getAlumno(this.token, id).subscribe(
				response=>{
					if(!response.alumno){
						//console.log("no devuelve el alumno");
						//this._router.navigate(['/']);
					}else{
						this.alumno = response.alumno;

						this._observacionAlumnoService.getObservacionesPorAlumno(this.token, id).subscribe(
							response=>{
								if(!response.observaciones){
									//this._router.navigate(['/']);
									//console.log("no hay observaciones en este alumno" + id);
								}else{
									this.observacionesAlumno = response.observaciones;

								}
							},
							error => {
								var errorMessage = <any>error;

								if(errorMessage != null){
									var body = JSON.parse(error._body);

									//console.log(error);
								}
							});
					}
				},
				error =>{
					var errorMessage = <any>error;
					//////////CUANDO SE VENCE LA SESION////////////////////////////					
					if (errorMessage.status==401 || errorMessage.status==403){
						////console.log()
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
				});
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

	onCancelObservacion(){
		this.confirmado=null;
	}

	onDeleteObservacion(id){
		this._observacionAlumnoService.deleteObservacionAlumno(this.token, id).subscribe(
			response =>{
					if(!response.observacionAlumno){
						alert('Error en el servidor');
						
					}else{
						alert('La observacion se ha eliminado correctamente');
						this.getObservacionesAlumno();
					}
				},
				error =>{
					var errorMessage = <any>error;

					if(errorMessage != null){
						var body = JSON.parse(error.body);
						this.alertMessage = body.message;
					}
				});
	}

	public downloadPDF(){
		const DATA = document.getElementById('Notas');
		const doc = new jsPDF('p', 'pt', 'a4');
		const options = {
			background: 'white',
			scale: 3
		};
		html2canvas(DATA, options).then((canvas) => {
			
			const img = canvas.toDataURL('image/PNG');

			const bufferX = 40;
			const bufferY = 35;
			const imgProps = (doc as any).getImageProperties(img);
			const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
			const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
			doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
			return doc;
		}).then((docResult) => {
			docResult.save(`${new Date().toISOString()}_notas.pdf`);
		});
	}

}

