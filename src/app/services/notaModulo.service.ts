import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map'; 
import { Observable } from 'rxjs/Observable'; 
import { GLOBAL} from './global';
import {map} from 'rxjs/operators';
import { Alumno} from '../models/alumno';
import { NotaMateria } from '../models/notaMateria';
import { NotaModulo } from '../models/notaModulo';


@Injectable()
export class NotaModuloService{
	/*public identity;
	public token;*/
	public url: string;

	constructor(private _http: Http){
		this.url = GLOBAL.url;
	}

	saveNotaModulo(token, notaModulo: NotaModulo){
		//return 'Hola mundo desde el servicio alumno';
		let params = JSON.stringify(notaModulo);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'saveNotaModulo', params, {headers: headers}).map(res=>res.json());
	}

	getObservacionesAlumno(token, page){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getObservacionesAlumno/'+page, options).map(res=>res.json());

	}

	getNotaModulo(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getNotaModulo/'+id, options).map(res=>res.json());
	}

	getObservacionesPorAlumno(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getObservacionesPorAlumno/'+id, options).map(res=>res.json());
	}

	getNotaModuloPorAlumnoYModulo(token, notaModulo: NotaModulo){
		//return 'Hola mundo desde el servicio alumno';
		let params = JSON.stringify(notaModulo);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'getNotaModuloPorAlumnoYModulo', params, {headers: headers}).map(res=>res.json());
	}


	getNotasMateriaPorParametros(token, alumno_id: string, materia_id:string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getObservacionesPorAlumno/'+alumno_id+'&'+materia_id, options).map(res=>res.json());
	}	

	getNotasModuloPorModuloCurso(token, notaModulo:NotaModulo){
		let params = JSON.stringify(notaModulo);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		//let options = new RequestOptions({headers: headers});
		return this._http.post(this.url+'getNotasModuloPorModuloCurso', params, {headers: headers}).map(res=>res.json());
	}
	

	//////////// GET MATERIA POR MATERIA ////////////////////////////
	getNotasMateriaPorMateria(token, id:string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getNotasMateriaPorMateria/'+ id, options).map(res=>res.json());
	}



	getNotasModuloPorModulo(token, id:string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getNotasModuloPorModulo/'+ id, options).map(res=>res.json());
	}



	getNotasMateriaPorMateriaAlumno(token, notaMateria: NotaMateria){
		//return 'Hola mundo desde el servicio curso';
		let params = JSON.stringify(notaMateria);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'getNotasMateriaPorMateriaAlumno', params, {headers: headers}).map(res=>res.json());
	}

	editNotaModulo(token, id: string, notaModulo: NotaModulo){
		//return 'Hola mundo desde el servicio alumno';
		let params = JSON.stringify(notaModulo);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.put(this.url+'updateNotaModulo/'+ id, params, {headers: headers}).map(res=>res.json());
	}

	deleteNotaModulo(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.delete(this.url+'deleteNotaModulo/'+id, options).map(res=>res.json());
	}



}