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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';




@Component({
	selector: 'observacionesCurso-list',
	templateUrl: '../views/observacionesCurso-list.html',
	providers: [UsuarioService, CursoService, ObservacionCursoService, ModuloService]

})

export class ObservacionCursoListComponent implements OnInit{
	public titulo: string;
	public materia: Materia;
	public curso: Curso;
	public observacionesCurso: ObservacionCurso[];
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public observacionCurso;
	
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _cursoService: CursoService,
		private _observacionCursoService: ObservacionCursoService,
	){
		this.titulo = 'Observaciones Del curso:';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.curso = new Curso('','','','','','','');
		this.materia = new Materia('','','','','','','','','');
		this.observacionCurso= new ObservacionCurso('','','','','','');
	}

	ngOnInit(){
		this.getObservacionesCursos();
	}

	getObservacionesCursos(){

		
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			
			this._cursoService.getCurso(this.token, id).subscribe(
				response=>{
					if(!response.curso){
						//console.log("no devuelve el curso");
						this._router.navigate(['/']);

					}else{
						this.curso = response.curso;
						

						this._observacionCursoService.getObservacionesPorCurso(this.token, id).subscribe(
							response=>{
								if(!response.observaciones){
									//this._router.navigate(['/']);
									//console.log("no hay observaciones en este curso" + id);
								}else{
									this.observacionesCurso = response.observaciones;
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

					////////CUANDO SE VENCE LA SESION////////////////////////////					
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
		this._observacionCursoService.deleteObservacionCurso(this.token, id).subscribe(
			response =>{
					if(!response.observacionCurso){
						alert('Error en el servidor');
						
					}else{
						alert('La observacion se ha eliminado correctamente');
						this.getObservacionesCursos();
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

