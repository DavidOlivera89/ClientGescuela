import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { DocenteService} from './services/docente.service';
import { Docente } from './models/docente';
import { UsuarioService } from './services/usuario.service';
import { Usuario } from './models/usuario';
import { GLOBAL } from './services/global';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UsuarioService]
// styleUrls: ['./app.component.css']
})
export class AppComponent{
  public title = 'APP_ESCUELA';
  public nombreEscuela: 'Escuela Ciudad de Yapeyú n° 707';
  public usuario: Usuario;
  public identity;
  public token;
  public errorMessage;
  public url: string;
 

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  	private _usuarioService:UsuarioService
  ){	

  	this.usuario = new Usuario('','','','','','','','','','',false,false,false,false);
  
    this.url = GLOBAL.url;
  }

  ngOnInit(){
  
     this.identity= this._usuarioService.getIdentity();
     this.token= this._usuarioService.getToken();

     this._router.navigate(['/']);
  }
  
  public onSubmit(){
    
     //Acá buscamos conseguir los datos del usuario identificado
   	this._usuarioService.signup(this.usuario).subscribe(
   		response =>{
   			
        let identity= response.usuario;
        this.identity=identity;

        if(!this.identity._id){
          alert("El usuario no está correctamente identificado");
        }else{
          // Crear el usuario en el localStorage para conservar la sesion
          localStorage.setItem('identity', JSON.stringify(identity));
          // Conseguir el token para enviarselo a cada peticion http
          this._usuarioService.signup(this.usuario, 'true').subscribe(
             response =>{
                //console.log(response);
                let token= response.token;
                this.token=token;

                if(this.token.length <= 0){
                   alert("El token no se ha generado correctamente");
                }else{
                   // Cargar el usuario en el localStorage para tener el token disponible
                   localStorage.setItem('token', token);
                   
                   this.usuario = new Usuario('','','','','','','','','','',false,false,false,false);

                 
                   if (identity.alumno==false){
                     this._router.navigate(['/docente/'+identity._id]);
                     //console.log("entra a component.ts alumno false");
                   }else{
                     if(identity.alumno==true){
                        this._router.navigate(['/alumno/'+identity._id]);
                
                     }
                   }
                }


             },
             error => {
                var errorMessage = <any>error;

                if (errorMessage != null){
                   var body= JSON.parse(error._body);
                   this.errorMessage = body.message;
                   console.log(error);
                }
             }
             );


        }


   		},
   		error => {
   			var errorMessage = <any>error;

   			if (errorMessage != null){
           var body= JSON.parse(error._body);
           this.errorMessage = body.message;
   				console.log(error);
   			}
   		}
   		);

  }

  public logout(){
     localStorage.removeItem('identity');
     localStorage.removeItem('token');
     localStorage.clear();
     this.identity=null;
     this.token=null;
     this._router.navigate(['/']);

  }
}
