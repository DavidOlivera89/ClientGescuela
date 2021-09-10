import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map'; 
import { Observable } from 'rxjs/Observable'; 
import { GLOBAL} from './global';
import {map} from 'rxjs/operators';

@Injectable()
export class UsuarioService{
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
		return this._http.post('/api/loginUser',params, {headers: headers}).pipe(map(res => res.json()));

		//"Para probar si anda el servicio"
		//return 'Hola mundo desde el servicio';
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


	register(user_to_register){
		let params = JSON.stringify(user_to_register);
		let headers = new Headers({'Content-Type':'application/json'});

		return this._http.post(this.url+'DIRECCION REGISTRAR DE API', params, {headers: headers})
				   .pipe(map(res => res.json()));

	}


	updateUser(user_to_update){
		let params=JSON.stringify(user_to_update);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':this.getToken()
		});
		console.log("aca estamos "+ user_to_update._id);
		console.log(params);
		if (user_to_update.alumno==true){
			return this._http.put(this.url+'updateAlumno/'+ user_to_update._id, params, 
			{headers: headers}).map(res => res.json());
		}else{
		return this._http.put(this.url+'updateDocente/'+ user_to_update._id, params, 
			{headers: headers}).map(res => res.json());
		}
	}

	cambiarClave(user_to_update, clave){
		let params=JSON.stringify(clave);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':this.getToken()
		});
		if (user_to_update.alumno==true){
			return this._http.put(this.url+'updateClaveAlumno/'+ user_to_update._id, params, 
			{headers: headers}).map(res => res.json());
		}else{
		return this._http.put(this.url+'updateClaveDocente/'+ user_to_update._id, params, 
			{headers: headers}).map(res => res.json());
		}
	}



}