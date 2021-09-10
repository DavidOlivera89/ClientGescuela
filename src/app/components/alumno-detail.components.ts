import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL} from '../services/global';
import { UsuarioService} from '../services/usuario.service';
import { Curso } from '../models/curso';
import { CursoService} from '../services/curso.service';
import { Alumno } from '../models/alumno';
import { AlumnoService} from '../services/alumno.service';
import { Materia } from '../models/materia';
import { MateriaService} from '../services/materia.service';
import { Modulo } from '../models/modulo';
import { ModuloService} from '../services/modulo.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';




@Component({
	selector: 'alumno-detail',
	templateUrl: '../views/alumno-detail.html',
	providers: [UsuarioService, CursoService, AlumnoService, MateriaService, ModuloService]

})

export class AlumnoDetailComponent implements OnInit{
	public titulo: string;
	public curso: Curso;
	public alumno: Alumno;
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public materias: Materia[];
	public modulos: Modulo[];
	public mostrarLasNotas: boolean;
	

	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _cursoService: CursoService,
		private _alumnoService: AlumnoService,
		private _materiaService: MateriaService,
		private _moduloService: ModuloService,
	){
		//this.titulo = 'Actualizar curso';
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.curso = new Curso('','','','','','','');
	

		
	}

	ngOnInit(){
		console.log('alumno-detail.component.ts está cargado');
		this.getAlumno();

	}

	getAlumno(){

		this._route.params.forEach((params: Params)=>{
			let id= params['id'];

			this._alumnoService.getAlumno(this.token, id).subscribe(
				response=>{
					if(!response.alumno){
					}else{
						this.alumno = response.alumno;

						let cursoId = this.alumno.ultimoCurso['ano'];

						this._cursoService.getCursoMMPorAlumno(this.token, this.alumno.ultimoCurso['_id']).subscribe(
							response=>{
								if(!response.curso){
									
								}else{
									this.curso = response.curso;
									this._materiaService.getMateriasYModulosPorCurso(this.token, this.curso).subscribe(
										response=>{
											if(!response.materias){
											}else{
												this.materias = response.materias;
												this.modulos = response.modulos;

											}
										},
										error =>{
											var errorMessage = <any>error;

											///////////////////////CUANDO SE VENCE LA SESION////////////////////////////					
											if (errorMessage.status==401 || errorMessage.status==403){
												alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
												this.logout();
												javascript:location.reload(true);

											}else{
												
											}
											
											if(errorMessage != null){
												var body = JSON.parse(error.body);
												this.alertMessage = body.message;
											}
										}

										);
								}
							},
							error =>{
								var errorMessage = <any>error;
								///////////////////////CUANDO SE VENCE LA SESION////////////////////////////					
								if (errorMessage.status==401 || errorMessage.status==403){
									
									alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
									this.logout();
									javascript:location.reload(true);

								}else{
									
								}
								
								if(errorMessage != null){
									var body = JSON.parse(error.body);
									this.alertMessage = body.message;

								}
							}

							);
					}
				},
				error =>{
					var errorMessage = <any>error;

					///////////////////////CUANDO SE VENCE LA SESION////////////////////////////					
					if (errorMessage.status==401 || errorMessage.status==403){
						alert("Su sesión ha expirado, por favor vuelva a iniciar sesión para continuar");
						this.logout();
						javascript:location.reload(true);

					}else{
						//console.log("no entra al ig");
					}
					/////////////////////////CUANDO SE VENCE LA SESION///////////////////////////		
					if(errorMessage != null){
						var body = JSON.parse(error.body);
						this.alertMessage = body.message;

					}
				}

				);
		});
	}


	public confirmado;
	onDeleteConfirm(id){
		this.confirmado=id;
	}

	onCancelAlumno(){
		this.confirmado=null;
	}

	onDeleteAlumno(id){
		console.log("Borrar el alumno"+ id);
		this._alumnoService.deleteAlumno(this.token, id).subscribe(
			response =>{
					if(!response.alumno){
						alert('Error en el servidor');
						
					}else{
						alert('El alumno se ha eliminado correctamente');
						//this.getAlumnos();
						
						this._router.navigate(['/alumnos/1']);
					}
				},
				error =>{
					var errorMessage = <any>error;

					if(errorMessage != null){
						var body = JSON.parse(error.body);
						this.alertMessage = body.message;

						console.log(error);
					}
				}
			);
	}


		logout(){
     localStorage.removeItem('identity');
     localStorage.removeItem('token');
     localStorage.clear();
     this.identity=null;
     this.token=null;

  }
	

  public downloadPDF(){
   
    const DATA = document.getElementById('alumno');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };

    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 40;
      const bufferY = 35;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
    });
  }
}

