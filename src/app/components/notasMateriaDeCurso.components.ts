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
import { Curso_Alumno } from '../models/curso_alumno';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';




@Component({
	selector: 'notas-por-curso',
	templateUrl: '../views/notaMateriaDeCursoList.html',
	providers: [UsuarioService, CursoService, ObservacionCursoService, MateriaService, NotaMateriaService, ModuloService]

})

export class NotaMateriaDeCursoListComponent implements OnInit{
	public titulo: string;
	public materia: Materia;
	public curso: Curso;
	public cursoActual: Curso;
	public alumnosCurso: Curso_Alumno[];
	public cursos: Curso[];
	public notaMateria: NotaMateria;
	public notasMaterias: NotaMateria[];
	public notasMateriasDeCurso:NotaMateria[];
	public notaMateriaEnviar: NotaMateria;
	public observacionesCurso: ObservacionCurso[];
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public observacionCurso;
	public notasMateriaCurso: NotaMateria[];
	public notaMateriaCurso: NotaMateria;
	public notasMateriaCursoFinales;
	public notasMateriaCursoRespaldo;
	public profesor1;
	public profesor2;
	
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _materiaService: MateriaService,
		private _cursoService: CursoService,
		private _observacionCursoService: ObservacionCursoService,
		private _notaMateriaService: NotaMateriaService,
	){
		this.titulo = 'Observaciones Del curso:';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.notaMateriaEnviar=new NotaMateria('','','','','','','','','');

		this.curso = new Curso('','','','','','','');
		this.materia = new Materia('','','','','','','','','');
		this.observacionCurso= new ObservacionCurso('','','','','','');
		this.notaMateria = new NotaMateria('','','','','','','','','');
	}

	ngOnInit(){
	
		this.getNotasMateria();
		this.getCursosPorMateria(this.materia);

	}

	
	getNotasMateria(){
		
		this._route.params.forEach((params: Params) => {
			let cursoId = params['curso._id'];
			let materiaId = params['materia._id'];

			this.getAlumnos_Curso(cursoId);
			
			this.getCurso(cursoId);			

			this.notaMateriaEnviar.materia=materiaId;
			this.notaMateriaEnviar.curso=cursoId;

			this._notaMateriaService.getNotasMateriaPorMateriaCurso(this.token, this.notaMateriaEnviar).subscribe(
				response=>{
					if(!response.notas){
						//console.log("no hay notas");
					}else{
						
						this.notasMateriaCurso= response.notas;
						this.notasMateriaCursoFinales = response.notasFinales;
						this.notasMateriaCursoRespaldo= response.notas;
						
					}	

				},
				error => {
					var errorMessage = <any>error;

					///////CUANDO SE VENCE LA SESION////////////////////////////					
					if (errorMessage.status==401 || errorMessage.status==403){
						////console.log()
						alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
						//this._router.navigate(['/']);
						this.logout();
						javascript:location.reload(true);

					}


					if(errorMessage != null){
						var body = JSON.parse(error._body);
						
						//console.log(error);
					}
				});
			
			this._materiaService.getMateria(this.token, materiaId).subscribe(
				response=>{
					if(!response.materia){
						//console.log("no devuelve la materia");
						this._router.navigate(['/']);
					}else{
						this.materia = response.materia;
						
						this.getCursosPorMateria(this.materia);
						
						this.notaMateria = new NotaMateria('','','','','','',response.materia._i,'','');
						
						this._notaMateriaService.getNotasMateriaPorMateria(this.token, this.materia._id).subscribe(
							response=>{
								if(!response.notas){
									//this._router.navigate(['/']);
									//console.log("no hay notas en este curso" + cursoId);
								}else{
									this.notasMaterias = response.notas;
									//console.log(this.notasMaterias);

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

	  	
	getCursosPorMateria(materia:Materia){
			this._cursoService.getCursosPorMateria(this.token, materia).subscribe(
				response =>{
					if(!response.cursos){
						//console.log("no llegan");
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

						//console.log(error);
					}
				});
		
	}

	getCurso(cursoId: string){
		this._cursoService.getCurso(this.token, cursoId).subscribe(
				response =>{
					if(!response.curso){
						//console.log("no llega el curso");
						this._router.navigate(['/']);
					}else{
						this.cursoActual = response.curso;
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

	getAlumnos_Curso(cursoId: string){
	this._cursoService.getAlumnos_Curso(this.token, cursoId).subscribe(
			response =>{
				if(!response.alumnos){
					//console.log("no se encuentran alumnosCurso");
					//this._router.navigate(['/']);
				}else{
					this.alumnosCurso = response.alumnos;
	
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


	public confirmado;

	public mostrarTodasLasNotas(){
		this.notasMateriaCurso=this.notasMateriaCursoRespaldo;
	}

	public mostrarNotasFinales(){
		this.notasMateriaCurso=this.notasMateriaCursoFinales;
	}
	
	onDeleteConfirm(id){
		this.confirmado=id;
	}

	onCancelNota(){
		this.confirmado=null;
	}

	onDeleteNota(id){
		//console.log("Borrar la nota"+ id);
		this._notaMateriaService.deleteNotaMateria(this.token, id).subscribe(
			response =>{
					if(!response.nota){
						alert('Error en el servidor');
						
					}else{
						alert('La materia se ha eliminado correctamente');
						this._router.navigate(['/notas-por-curso, response.nota.curso, response.nota.materia']);
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

