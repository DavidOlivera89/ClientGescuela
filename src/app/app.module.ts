import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';
import { HttpModule} from '@angular/http';
import { routing, appRoutingProviders} from './app.routing';


import { AppComponent } from './app.component';
import { HomeComponent} from './components/home.components';
import { UsuarioEditComponent} from './components/user-edits.components';
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
import { ObservacionCursoEditComponent } from './components/observacionCurso-edit.components';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UsuarioEditComponent,
    CursosListComponent,
    CursoAddComponent,
    CursoEditComponent,
    CursoDetailComponent,
    AlumnosListComponent,
    AlumnoEditComponent,
    AlumnoAddComponent,
    AlumnoDetailComponent,
    DocentesListComponent,
    DocenteAddComponent,
    DocenteEditComponent,
    DocenteDetailComponent,
    MateriasListComponent,
    MateriaAddComponent,
    MateriaDetailComponent,
    MateriaEditComponent,
    ModuloAddComponent,
    ModuloDetailComponent,
    ModuloEditComponent,
    ObservacionCursoListComponent,
    ObservacionCursoAddComponent,
    ObservacionAlumnoListComponent,
    ObservacionAlumnoAddComponent,
    NotaMateriaListComponent,
    NotaMateriaDeCursoListComponent,
    NotaMateriaAddComponent,
    NotaModuloListComponent,
    NotaModuloDeCursoListComponent,
    NotaModuloAddComponent,
    NotaMateriaAlumno,
    NotaModuloAlumno,
    NotasAlumno,
    NotasFinalesAlumno,
    NotasMateriaUnCurso,
    NotasFinalesMateriaCursoComponent,
    NotasFinalesModuloCursoComponent,
    NotaMateriaEditComponent,
    NotaModuloEditComponent,
    ObservacionAlumnoEditComponent,
    ObservacionCursoEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
        