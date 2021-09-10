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
export class MateriaService{
	/*public identity;
	public token;*/
	public url: string;

	constructor(private _http: Http){
		this.url = GLOBAL.url;
	}

	addMateria(token, materia: Materia){
		//return 'Hola mundo desde el servicio materia';
		let params = JSON.stringify(materia);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'saveMateria', params, {headers: headers}).map(res=>res.json());
	}

	getMateriasYModulos(token, page){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getMateriasModulos/'+page, options).map(res=>res.json());

	}

	getTodasMateriasYModulos(token){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getTodasMateriasYModulos/', options).map(res=>res.json());

	}

	getMateria(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getMateria/'+id, options).map(res=>res.json());
	}

	editMateria(token, id: string, materia: Materia){
		//return 'Hola mundo desde el servicio materia';
		let params = JSON.stringify(materia);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.put(this.url+'updateMateria/'+ id, params, {headers: headers}).map(res=>res.json());
	}

	deleteMateria(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.delete(this.url+'deleteMateria/'+id, options).map(res=>res.json());
	}

	getMateriasYModulosPorCurso(token, curso: Curso){
		//return 'Hola mundo desde el servicio materia';
		let params = JSON.stringify(curso);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'getMateriasYModulosPorCurso', params, {headers: headers}).map(res=>res.json());
	}

	getMateriasYModulosPorBusqueda(token, materia: Materia){
		//return 'Hola mundo desde el servicio materia';
		let params = JSON.stringify(materia);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'getMateriasYModulosPorBusqueda', params, {headers: headers}).map(res=>res.json());
	}

	getMateriasYModulosPorrBusqueda(token, materia: Materia, page){
		//return 'Hola mundo desde el servicio materia';
		let params = JSON.stringify(materia);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'getMateriasYModulosPorrBusqueda/'+page, params, {headers: headers}).map(res=>res.json());
	}

}