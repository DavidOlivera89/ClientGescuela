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
import { NotaMateria } from '../models/notaMateria';
import { NotaMateriaService} from '../services/notaMateria.service';
import { NotaModulo } from '../models/notaModulo';
import { NotaModuloService} from '../services/notaModulo.service';
import { Docente } from '../models/docente';
import { DocenteService} from '../services/docente.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



@Component({
	selector: 'notas-modulo-alumno',
	templateUrl: '../views/notas-modulo-alumno.html',
	providers: [UsuarioService, CursoService, AlumnoService, MateriaService, ModuloService, NotaMateriaService, NotaModuloService]

})

export class NotaModuloAlumno implements OnInit{
	public titulo: string;
	public curso: Curso;
	public alumno: Alumno;
	public identity;
	public token;
	public url: string;
	public alertMessage; 
	public materias: Materia[];
	public modulos: Modulo[];
	public notaMateria: NotaMateria;
	public notasMateria: NotaMateria[];
	public mostrarLasNotas: boolean;
	public materia: Materia;
	public notaModulo: NotaModulo;
	public notasModulo:NotaModulo[];
	public modulo: Modulo;
	public profesor1: Docente;
	public profesor2: Docente;
	public notaFINAL: NotaMateria;
	public promedioNotas: Number;
	public noHayNotas: boolean;
		

	

	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
		private _cursoService: CursoService,
		private _alumnoService: AlumnoService,
		private _materiaService: MateriaService,
		private _moduloService: ModuloService,
		private _notaMateriaService: NotaMateriaService,
		private _notaModuloService: NotaModuloService
	){
		this.identity = this._usuarioService.getIdentity();
		this.token = this._usuarioService.getToken();
		this.url = GLOBAL.url;
		this.curso = new Curso('','','','','','','');
		this.notaMateria = new NotaMateria('','','','','','','','','');
		this.notaModulo = new NotaModulo('','','','','','','','','','');
		this.promedioNotas= 0;

		
	}

	ngOnInit(){
		this.getAlumno();

	}

	getAlumno(){

		this._route.params.forEach((params: Params)=>{
			let alumnoId= params['alumno'];
			let moduloId= params['modulo'];

			this._moduloService.getModulo(this.token, moduloId).subscribe(
				response=>{
					if(!response.modulo){
						this._router.navigate(['/']);
					}else{
						this.modulo = response.modulo;
						
						this.profesor1= response.modulo.profesor1;
						if (response.modulo.profesor2 && response.modulo.profesor2!=""){
							this.profesor2 = response.modulo.profesor2;
						}
						
						this.notaModulo.modulo = moduloId;
						this.notaModulo.alumno = alumnoId; 
						
						this._notaModuloService.getNotaModuloPorAlumnoYModulo(this.token, this.notaModulo).subscribe(
							response=>{
								if(!response.notasModulos){
									//this._router.navigate(['/']);
								}else{
									this.notasModulo = response.notasModulos;

										if (this.notasModulo.length==0){
											this.noHayNotas=true;
										}else {
											this.noHayNotas=false;
										}

										console.log(this.notasModulo);
																								
										this.notaFINAL = this.notasModulo.find( perro => perro.identificador === 'CALIFICACION FINAL' );

										if(!this.notaFINAL){
											
											console.log("No tiene nota final" + this.notaFINAL);

											var sumatoriaObjeto = this.notasModulo.reduce(function(acumulador, siguienteValor){
												  return {
												    valor: acumulador.valor + parseInt(siguienteValor.valor)}; 
													}, {valor: 0}); 
											this.promedioNotas = sumatoriaObjeto.valor / this.notasModulo.length;
											console.log("El promedio de las notas es: " + this.promedioNotas);
								

										}else{
											console.log("La nota final es"+ this.notaFINAL);
											

											var sumatoriaObjeto = this.notasModulo.reduce(function(acumulador, siguienteValor){
												  return {
												    valor: acumulador.valor + parseInt(siguienteValor.valor)}; 
													}, {valor: 0}); 
											this.promedioNotas = sumatoriaObjeto.valor / this.notasModulo.length;
											console.log("El promedio de las notas es: " + this.promedioNotas);


										}




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
					///CUANDO SE VENCE LA SESION////////////////////////////					
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
				}

				);

			this._alumnoService.getAlumno(this.token, alumnoId).subscribe(
				response=>{
					if(!response.alumno){
						this._router.navigate(['/']);
					}else{
						this.alumno = response.alumno;

						let cursoId = this.alumno.ultimoCurso['ano'];

						this._cursoService.getCursoMMPorAlumno(this.token, this.alumno.ultimoCurso['_id']).subscribe(
							response=>{
								if(!response.curso){
									this._router.navigate(['/']);
								}else{
									this.curso = response.curso;


									this._materiaService.getMateriasYModulosPorCurso(this.token, this.curso).subscribe(
										response=>{
											if(!response.materias){
												this._router.navigate(['/']);
											}else{
												this.materias = response.materias;

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

  	
	mostrarNotas(id){
		this.notaMateria.alumno=this.alumno._id;
		this.notaMateria.materia= id; 
		this._notaMateriaService.getNotaMateriaPorAlumnoYMateria(this.token, this.notaMateria).subscribe(
					response=>{
						if(!response.notasMaterias){
							this._router.navigate(['/']);
						}else{
							this.notasMateria = response.notasMaterias;
							this.mostrarLasNotas=true;

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

