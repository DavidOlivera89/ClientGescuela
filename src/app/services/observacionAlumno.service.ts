import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map'; 
import { Observable } from 'rxjs/Observable'; 
import { GLOBAL} from './global';
import {map} from 'rxjs/operators';
import { Alumno} from '../models/alumno';
import { ObservacionAlumno } from '../models/observacionAlumno';


@Injectable()
export class ObservacionAlumnoService{
	/*public identity;
	public token;*/
	public url: string;

	constructor(private _http: Http){
		this.url = GLOBAL.url;
	}

	addObservacionAlumno(token, observacionAlumno: ObservacionAlumno){
		//return 'Hola mundo desde el servicio alumno';
		let params = JSON.stringify(observacionAlumno);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'saveObservacionAlumno', params, {headers: headers}).map(res=>res.json());
	}

	getObservacionesAlumno(token, page){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getObservacionesAlumno/'+page, options).map(res=>res.json());

	}

	getObservacionAlumno(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getObservacionAlumno/'+id, options).map(res=>res.json());
	}

	getObservacionesPorAlumno(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getObservacionesPorAlumno/'+id, options).map(res=>res.json());
	}

	editObservacionAlumno(token, id: string, observacionAlumno: ObservacionAlumno){
		//return 'Hola mundo desde el servicio alumno';
		let params = JSON.stringify(observacionAlumno);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.put(this.url+'updateObservacionAlumno/'+ id, params, {headers: headers}).map(res=>res.json());
	}

	deleteObservacionAlumno(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.delete(this.url+'deleteObservacionAlumno/'+id, options).map(res=>res.json());
	}



}