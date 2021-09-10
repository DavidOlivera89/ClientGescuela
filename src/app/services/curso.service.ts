import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map'; 
import { Observable } from 'rxjs/Observable'; 
import { GLOBAL} from './global';
import {map} from 'rxjs/operators';
import { Curso} from '../models/curso';
import { Materia} from '../models/materia';
import { Modulo} from '../models/modulo';


@Injectable()
export class CursoService{
	/*public identity;
	public token;*/
	public url: string;

	constructor(private _http: Http){
		this.url = GLOBAL.url;
	}

	addCurso(token, curso: Curso){
		//return 'Hola mundo desde el servicio curso';
		let params = JSON.stringify(curso);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'saveCurso', params, {headers: headers}).map(res=>res.json());
	}

	getCursosPorMateria(token, materia: Materia){
		//return 'Hola mundo desde el servicio curso';
		let params = JSON.stringify(materia);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'getCursosPorMateria', params, {headers: headers}).map(res=>res.json());
	}

	getCursosPorBusqueda(token, curso: Curso){
		//return 'Hola mundo desde el servicio curso';
		let params = JSON.stringify(curso);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'getCursosPorBusqueda', params, {headers: headers}).map(res=>res.json());
	}

	getCursosPorrBusqueda(token, curso: Curso, page){
		//return 'Hola mundo desde el servicio alumno';
		let params = JSON.stringify(curso);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'getCursosPorrBusqueda/'+page, params, {headers: headers}).map(res=>res.json());
	}

	getCursosPorModulo(token, modulo: Modulo){
		//return 'Hola mundo desde el servicio curso';
		let params = JSON.stringify(modulo);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'getCursosPorModulo', params, {headers: headers}).map(res=>res.json());
	}

	getCursosPorPreceptor(token, id: string){
		//return 'Hola mundo desde el servicio curso';
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getCursosPorPreceptor/'+id, options).map(res=>res.json());
}
	

		getCursoMMPorAlumno(token, id: string){
		//return 'Hola mundo desde el servicio curso';
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getCursoMMPorAlumno/'+id, options).map(res=>res.json());
}

	getCursos(token, page){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getCursos/'+page, options).map(res=>res.json());

	}

	
	getTodosLosCursos(token){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getTodosLosCursos/', options).map(res=>res.json());

	}
	getCurso(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getCurso/'+id, options).map(res=>res.json());
	}

	editCurso(token, id: string, curso: Curso){
		//return 'Hola mundo desde el servicio curso';
		let params = JSON.stringify(curso);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.put(this.url+'updateCurso/'+ id, params, {headers: headers}).map(res=>res.json());
	}

	deleteCurso(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.delete(this.url+'deleteCurso/'+id, options).map(res=>res.json());
	}


	getAlumnos_Curso(token, id: string){
		//return 'Hola mundo desde el servicio curso';
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getAlumnos_Curso/'+id, options).map(res=>res.json());
}
}