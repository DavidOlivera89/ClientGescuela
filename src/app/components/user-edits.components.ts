import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL } from '../services/global';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario';

@Component({
	selector: 'user-edit',
	templateUrl: '../views/user-edit.html',
	providers: [UsuarioService]
})

export class UsuarioEditComponent implements OnInit{
	public titulo: string;
	public nombreEscuela: string;
	public usuario: Usuario;
	public identity;
	public token;
	public alertMessage;
	public url: string;
	public cambiarClave: boolean;
	public clave: Object;
	constructor(
		private _usuarioService: UsuarioService,
		private _route: ActivatedRoute,
		private _router: Router,
		){
		this.titulo = 'Mis datos de cuenta:';
		this.cambiarClave= false;
		this.clave = new Object;
		// localStorage
		this.identity= this._usuarioService.getIdentity();
		this.token= this._usuarioService.getToken();
		this.usuario = this.identity;
		this.url = GLOBAL.url;

		
	}

	ngOnInit(){

	}


	onSubmit(){

		this.clave['identityClave'] = this.identity.password;
		this.clave['id']= this.identity._id;
		
		if (this.clave != ""){
		this._usuarioService.cambiarClave(this.usuario, this.clave).subscribe(

			response=>{
				
				if(!response.usuario){
					//this.alertMessage='El usuario no se ha podido actualizar';
					alert(response.message);
					//alert("La actualización de contraseña ha fallado...");
					
				}else{
					//this.usuario= response.usuario;
					alert("La contraseña se ha actualizado con exito");
					if (this.identity.alumno!=true){
						this._router.navigate(['/docente', this.identity._id]);
					} else{
						this._router.navigate(['/alumno', this.identity._id]);
						
						
					}
				}
			},
			error =>{
				var errorMessage = <any>error;

				if(errorMessage != null){
					var body= JSON.parse(error._body);
					this.alertMessage=body.message;

					//console.log(error);
				}
			}
			);
		}
		else{
			alert("No puede tener una contraseña vacía");
		
		}

	}

	setCambiarClave(){
		if (this.cambiarClave==false){
			this.cambiarClave=true;
		}else{
			this.cambiarClave=false;
		}
		
	}

}

