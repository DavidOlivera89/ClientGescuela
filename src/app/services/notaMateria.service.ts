import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map'; 
import { Observable } from 'rxjs/Observable'; 
import { GLOBAL} from './global';
import {map} from 'rxjs/operators';
import { Alumno} from '../models/alumno';
import { NotaMateria } from '../models/notaMateria';


@Injectable()
export class NotaMateriaService{
	/*public identity;
	public token;*/
	public url: string;

	constructor(private _http: Http){
		this.url = GLOBAL.url;
	}

	saveNotaMateria(token, notaMateria: NotaMateria){
	
		let params = JSON.stringify(notaMateria);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'saveNotaMateria', params, {headers: headers}).map(res=>res.json());
	}

	getNotaMateriaPorAlumnoYMateria(token, notaMateria: NotaMateria){
		//return 'Hola mundo desde el servicio alumno';
		let params = JSON.stringify(notaMateria);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'getNotaMateriaPorAlumnoYMateria', params, {headers: headers}).map(res=>res.json());
	}

	getObservacionesAlumno(token, page){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getObservacionesAlumno/'+page, options).map(res=>res.json());

	}

	getNotaMateria(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getNotaMateria/'+id, options).map(res=>res.json());
	}

	getObservacionesPorAlumno(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getObservacionesPorAlumno/'+id, options).map(res=>res.json());
	}


	getNotasMateriaPorParametros(token, alumno_id: string, materia_id:string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getNotasMateriaPorParametros/'+alumno_id+'&'+materia_id, options).map(res=>res.json());
	}



	getNotasMateriaPorMateriaCurso(token, notaMateria:NotaMateria){
		let params = JSON.stringify(notaMateria);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		//let options = new RequestOptions({headers: headers});
		return this._http.post(this.url+'getNotasMateriaPorMateriaCurso', params, {headers: headers}).map(res=>res.json());
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

	getNotasMateriaYModuloPorAlumno(token, id:string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getNotasMateriaYModuloPorAlumno/'+ id, options).map(res=>res.json());
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

	editNotaMateria(token, id: string, notaMateria: NotaMateria){
		//return 'Hola mundo desde el servicio alumno';
		let params = JSON.stringify(notaMateria);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.put(this.url+'updateNotaMateria/'+ id, params, {headers: headers}).map(res=>res.json());
	}

	deleteNotaMateria(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.delete(this.url+'deleteNotaMateria/'+id, options).map(res=>res.json());
	}



}