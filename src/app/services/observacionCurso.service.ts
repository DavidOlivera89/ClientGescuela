import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map'; 
import { Observable } from 'rxjs/Observable'; 
import { GLOBAL} from './global';
import {map} from 'rxjs/operators';
import { Curso} from '../models/curso';
import { ObservacionCurso } from '../models/observacionCurso';


@Injectable()
export class ObservacionCursoService{
	/*public identity;
	public token;*/
	public url: string;

	constructor(private _http: Http){
		this.url = GLOBAL.url;
	}

	addObservacionCurso(token, observacionCurso: ObservacionCurso){
		
		let params = JSON.stringify(observacionCurso);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'saveObservacionCurso', params, {headers: headers}).map(res=>res.json());
	}

	getObservacionesCurso(token, page){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getObservacionesCurso/'+page, options).map(res=>res.json());

	}

	getObservacionCurso(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getObservacionCurso/'+id, options).map(res=>res.json());
	}

	getObservacionesPorCurso(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getObservacionesPorCurso/'+id, options).map(res=>res.json());
	}

	editObservacionCurso(token, id: string, observacionCurso: ObservacionCurso){
		//return 'Hola mundo desde el servicio curso';
		let params = JSON.stringify(observacionCurso);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.put(this.url+'updateObservacionCurso/'+ id, params, {headers: headers}).map(res=>res.json());
	}

	deleteObservacionCurso(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.delete(this.url+'deleteObservacionCurso/'+id, options).map(res=>res.json());
	}


}