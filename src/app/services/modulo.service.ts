import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map'; 
import { Observable } from 'rxjs/Observable'; 
import { GLOBAL} from './global';
import {map} from 'rxjs/operators';
import { Curso} from '../models/curso';
import { Materia } from '../models/materia';
import { Modulo } from '../models/modulo';

@Injectable()
export class ModuloService{
	/*public identity;
	public token;*/
	public url: string;

	constructor(private _http: Http){
		this.url = GLOBAL.url;
	}

	addModulo(token, modulo: Modulo){
		//return 'Hola mundo desde el servicio modulo';
		let params = JSON.stringify(modulo);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'saveModulo', params, {headers: headers}).map(res=>res.json());
	}

	getMateriasYModulos(token, page){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getMateriasModulos/'+page, options).map(res=>res.json());

	}

	getModulo(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getModulo/'+id, options).map(res=>res.json());
	}

	editModulo(token, id: string, modulo: Modulo){
		//return 'Hola mundo desde el servicio modulo';
		let params = JSON.stringify(modulo);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.put(this.url+'updateModulo/'+ id, params, {headers: headers}).map(res=>res.json());
	}

	deleteModulo(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.delete(this.url+'deleteModulo/'+id, options).map(res=>res.json());
	}

	getModulos(token, materiaId = null){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers:headers});

		if(materiaId == null){
			return this._http.get(this.url+'getModulos', options)
						 .map(res => res.json());
		}else{
			return this._http.get(this.url+'getModulos/'+materiaId, options)
						 .map(res => res.json());
		}

	}

}