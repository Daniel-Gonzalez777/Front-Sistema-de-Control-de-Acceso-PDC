// Único lugar del proyecto donde vive la URL del backend.
// Si el backend corre en otro puerto o servidor, solo hay que cambiar esta línea.
import { environment } from '../../environments/environment';

export const API_BASE = environment.apiUrl;
