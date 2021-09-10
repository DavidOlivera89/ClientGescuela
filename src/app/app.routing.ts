import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { HomeComponent} from './components/home.components';
//import componentes
import {UsuarioEditComponent} from './components/user-edits.components';
import { CursosListComponent} from './components/cursos-list.components';
import { CursoAddComponent} from './components/curso-add.components';
import { CursoEditComponent} from './components/curso-edit.components';
import { CursoDetailComponent} from './components/curso-detail.components';
import { AlumnosListComponent} from './components/alumnos-list.components';
import { AlumnoEditComponent} from './components/alumno-edit.components';
import { AlumnoAddComponent} from './components/alumno-add.components';
import { AlumnoDetailComponent} from './components/alumno-detail.components';
import { DocentesListComponent} from './components/docentes-list.components';
import { DocenteAddComponent} from './components/docente-add.components';
import { DocenteEditComponent} from './components/docente-edit.components';
import { DocenteDetailComponent} from './components/docente-detail.components';
import { MateriasListComponent} from './components/materias-list.components';
import { MateriaAddComponent} from './components/materia-add.components';
import { MateriaDetailComponent} from './components/materia-detail.components';
import { MateriaEditComponent} from './components/materia-edit.components';
import { ModuloAddComponent} from './components/modulo-add.components';
import { ModuloDetailComponent} from './components/modulo-detail.components';
import { ModuloEditComponent} from './components/modulo-edit.components';
import { ObservacionCursoListComponent} from './components/observacionesCurso-list.components';
import { ObservacionCursoAddComponent} from './components/observacionCurso-add.components';
import { ObservacionAlumnoListComponent} from './components/observacionAlumno-list.components';
import { ObservacionAlumnoAddComponent} from './components/observacionAlumno-add.component';
import { NotaMateriaListComponent } from './components/notasMateria-list.components';
import { NotaMateriaDeCursoListComponent } from './components/notasMateriaDeCurso.components';
import { NotaMateriaAddComponent } from './components/notaMateria-add.components';
import { NotaModuloListComponent } from './components/notasModulo-list.components';
import { NotaModuloDeCursoListComponent } from './components/notasModuloDeCurso.components';
import { NotaModuloAddComponent } from './components/notaModulo-add.components';
import { NotaMateriaAlumno } from './components/notaMateriaAlumno.components';
import { NotaModuloAlumno } from './components/notaModuloAlumno.components';
import { NotasAlumno } from './components/notasAlumno.components';
import { NotasFinalesAlumno} from './components/notasFinalesAlumno.components';
import { NotasMateriaUnCurso } from './components/notasMateriaUnCurso.components';
import { NotasFinalesMateriaCursoComponent } from './components/notasFinalesCurso.components';
import { NotasFinalesModuloCursoComponent } from './components/notasFinalesModuloCurso.components';
import { NotaMateriaEditComponent } from './components/notaMateria-edit.components';
import { NotaModuloEditComponent } from './components/notaModulo-edit.components';
import { ObservacionAlumnoEditComponent } from './components/observacionAlumno-edit.components';
import { ObservacionCursoEditComponent }  from './components/observacionCurso-edit.components';                                            

const appRoutes: Routes = [

 	{path: '', component: HomeComponent},
 	
 	{path: 'cursos/:page', component: CursosListComponent},
 	{path: 'crear-curso', component: CursoAddComponent},
 	{path: 'editar-curso/:id', component: CursoEditComponent},
 	{path: 'curso/:id', component: CursoDetailComponent},
 	
 	{path: 'alumnos/:page', component: AlumnosListComponent},
 	{path: 'crear-alumno', component: AlumnoAddComponent},
 	{path: 'editar-alumno/:id', component: AlumnoEditComponent},
 	{path: 'alumno/:id', component: AlumnoDetailComponent},
 	
 	{path: 'docentes/:page', component: DocentesListComponent},
 	{path: 'crear-docente', component: DocenteAddComponent},
 	{path: 'editar-docente/:id', component: DocenteEditComponent},
 	{path: 'docente/:id', component: DocenteDetailComponent},
 	

 	{path: 'materias/:page', component: MateriasListComponent},
 	{path: 'crear-materia', component: MateriaAddComponent},
 	{path: 'materia/:id', component: MateriaDetailComponent},
 	{path: 'editar-materia/:id', component: MateriaEditComponent},
 	
 	{path: 'crear-modulo/:materia', component: ModuloAddComponent},
 	{path: 'modulo/:id', component: ModuloDetailComponent},
 	{path: 'editar-modulo/:id', component: ModuloEditComponent},
 	
 	{path: 'observaciones-curso/:id', component: ObservacionCursoListComponent},
 	{path: 'crear-observacion-curso/:curso', component: ObservacionCursoAddComponent},
 	
 	{path: 'observaciones-alumno/:id', component: ObservacionAlumnoListComponent},
 	{path: 'crear-observacion-alumno/:alumno', component: ObservacionAlumnoAddComponent},
 	{path: 'observacion-alumno-edit/:id', component: ObservacionAlumnoEditComponent},
 	{path: 'observacion-curso-edit/:id', component: ObservacionCursoEditComponent},
 	
 	{path: 'notas-materia/:id', component: NotaMateriaListComponent},
 	{path: 'notas-por-curso/:curso._id/:materia._id', component: NotaMateriaDeCursoListComponent},
 	{path: 'notas-materia-curso/:curso._id/:materia._id', component: NotasMateriaUnCurso},
 	
 	{path: 'nota-materia-add/:materia/:curso', component: NotaMateriaAddComponent },
 	{path: 'nota-materia-edit/:nota', component: NotaMateriaEditComponent },
 	{path: 'nota-modulo-edit/:nota', component: NotaModuloEditComponent },
 	

 	{path: 'notas-materia-alumno/:materia/:alumno', component: NotaMateriaAlumno },
 	{path: 'notas-finales-materia-curso/:curso._id/:materia._id', component: NotasFinalesMateriaCursoComponent},
 	{path: 'notas-finales-modulo-curso/:curso._id/:modulo._id', component: NotasFinalesMateriaCursoComponent},

 
 	{path: 'notas-modulo/:id', component: NotaModuloListComponent},
 	{path: 'notas-modulo-por-curso/:curso._id/:modulo._id', component: NotaModuloDeCursoListComponent},
 	{path: 'nota-add-modulo/:modulo/:curso', component: NotaModuloAddComponent },
 	{path: 'notas-modulo-alumno/:modulo/:alumno', component: NotaModuloAlumno },
 	
 	{path: 'notas-alumno/:alumno', component: NotasAlumno},
 	{path: 'notas-finales-alumno/:alumno', component: NotasFinalesAlumno},
	

 	{path: 'mis-datos', component: UsuarioEditComponent},
 	{path: 'home/identity._id', component: HomeComponent},
 	{path: '**', component: HomeComponent}

];

export const appRoutingProviders: any[] = [];
//export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
//export const routing: ModuleWithProviders<Route> = RouterModule.forRoot(appRoutes);

export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
