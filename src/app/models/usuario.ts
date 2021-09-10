export class Usuario{
	constructor(
		public _id: string,
		public name: string,
		public surname: string,
		public image: string,
		public tipo_dni: string,
		public n_dni: string,
		public fecha_nacimiento: string,
		public telefono: string,
		public email: string,
		public password: string,
		public profesor: boolean,
	    public preceptor: boolean,
	    public tutor: boolean,
	    public alumno: boolean
	){}
}