import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map'; 
import { Observable } from 'rxjs/Observable'; 
import { GLOBAL} from './global';
import {map} from 'rxjs/operators';
import { Curso} from '../models/curso';
import { Alumno } from '../models/alumno';

@Injectable()
export class AlumnoService{
	/*public identity;
	public token;*/
	public url: string;

	constructor(private _http: Http){
		this.url = GLOBAL.url;
	}

	addAlumno(token, alumno: Alumno){
		//return 'Hola mundo desde el servicio alumno';
		let params = JSON.stringify(alumno);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'saveAlumno', params, {headers: headers}).map(res=>res.json());
	}

	

	getAlumno(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getAlumno/'+id, options).map(res=>res.json());
	}

	editAlumno(token, id: string, alumno: Alumno){
		//return 'Hola mundo desde el servicio alumno';
		let params = JSON.stringify(alumno);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.put(this.url+'updateAlumno/'+ id, params, {headers: headers}).map(res=>res.json());
	}

	deleteAlumno(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.delete(this.url+'deleteAlumno/'+id, options).map(res=>res.json());
	}

	getAlumnosPorCurso(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getAlumnosPorCurso/'+id, options).map(res=>res.json());
	
	}

	
	getAlumnosPorBusqueda(token, alumno: Alumno){
		//return 'Hola mundo desde el servicio alumno';
		let params = JSON.stringify(alumno);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'getAlumnosPorBusqueda', params, {headers: headers}).map(res=>res.json());
	}

	getAlumnos(token, page){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getAlumnos/'+page, options).map(res=>res.json());

	}

	getAlumnosPorrBusqueda(token, alumno: Alumno, page){
		//return 'Hola mundo desde el servicio alumno';
		let params = JSON.stringify(alumno);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'getAlumnosPorrBusqueda/'+page, params, {headers: headers}).map(res=>res.json());
	}

}