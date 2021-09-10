import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map'; 
import { Observable } from 'rxjs/Observable'; 
import { GLOBAL} from './global';
import {map} from 'rxjs/operators';
import { Curso} from '../models/curso';
import { Alumno } from '../models/alumno';
import { Docente } from '../models/docente';
import { DocenteCursoMateriaBuscar} from '../models/docenteCursoMateriaBuscar';

@Injectable()
export class DocenteService{
	public identity;
	public token;
	public url: string;

	constructor(private _http: Http){
		this.url = GLOBAL.url;
	}

	signup(user_to_login, gethash=null){
		if(gethash != null){
			user_to_login.gethash = gethash;
		}
		let json= JSON.stringify(user_to_login);
		let params = json;
		let headers = new Headers({'Content-Type':'application/json'});
		return this._http.post('/api/loginUser',params, {headers: headers})
						 .pipe(map(res => res.json()));

	}


	
	registrar(user_to_register){
		let params = JSON.stringify(user_to_register);
		let headers = new Headers({'Content-Type':'application/json'});

		return this._http.post(this.url+'RUTA_DE_REGISTRO', params, {headers: headers})
						 .pipe(map(res => res.json()));
	}

	
	update_usuario(user_to_update){
		let params = JSON.stringify(user_to_update);
		let headers = new Headers({'Content-Type':'application/json',
								   'Authorization': this.getToken()});

		return this._http.put(this.url+'RUTA_DE_ACTUALIZAR/'+user_to_update._id, 
			params, {headers: headers}).pipe(map(res => res.json()));
	}


	getIdentity(){
		let identity = JSON.parse(localStorage.getItem('identity'));

		if(identity!="undefined"){
			this.identity=identity;
		}else{
			this.identity=null;
		}
		return this.identity;
	}


	getToken(){
		let token = localStorage.getItem('token');

		if(token!=undefined){
			this.token = token;
		}else{
			this.token = null;
		}
		return this.token;
	}

	addDocente(token, docente: Docente){
		//return 'Hola mundo desde el servicio alumno';
		let params = JSON.stringify(docente);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'saveDocente', params, {headers: headers}).map(res=>res.json());
	}

	getDocente(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		//console.log(id);

		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getDocente/'+id, options).map(res=>res.json());
	}

	getDocentes(token, page){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getDocentes/'+page, options).map(res=>res.json());

	}


	editDocente(token, id: string, docente: Docente){
		//return 'Hola mundo desde el servicio alumno';
		let params = JSON.stringify(docente);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.put(this.url+'updateDocente/'+ id, params, {headers: headers}).map(res=>res.json());
	}

	deleteDocente(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		let options = new RequestOptions({headers: headers});
		return this._http.delete(this.url+'deleteDocente/'+id, options).map(res=>res.json());
	}

	getTodosLosProfesores(token){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getTodosLosProfesores/', options).map(res=>res.json());
	}

	getTodosLosPreceptores(token){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getTodosLosPreceptores/', options).map(res=>res.json());
	}

	getTodosLosTutores(token){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'getTodosLosTutores/', options).map(res=>res.json());
	}

	getMateriasModulosCursosDeDocente(token, docente: Docente){
		//return 'Hola mundo desde el servicio alumno';
		let params = JSON.stringify(docente);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'getMateriasModulosCursosDeDocente', params, {headers: headers}).map(res=>res.json());
	

	}

	getDocentesPorBusqueda(token, docente: DocenteCursoMateriaBuscar){
		//return 'Hola mundo desde el servicio alumno';
		let params = JSON.stringify(docente);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'getDocentesPorBusqueda', params, {headers: headers}).map(res=>res.json());
	}


	getDocentesPorrBusqueda(token, docente: DocenteCursoMateriaBuscar, page){
		//return 'Hola mundo desde el servicio alumno';
		let params = JSON.stringify(docente);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'getDocentesPorrBusqueda/'+ page, params, {headers: headers}).map(res=>res.json());
	}
}


