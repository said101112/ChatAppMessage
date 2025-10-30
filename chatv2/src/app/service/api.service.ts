import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private Http: HttpClient) {}

  id: any;

  // ✅ Enregistrement
  addUser(userdata: any): Observable<any> {
    console.log('🔐 Envoi des données de signup :', userdata);
    return this.Http.post('http://localhost:3000/auth/signup', userdata);
  }

  // ✅ Connexion
  connexion(userdata: any): Observable<any> {
    console.log('🔑 Tentative de connexion :', userdata);
    return this.Http.post('http://localhost:3000/auth/signin', userdata, { withCredentials: true });
  }

  // ✅ Récupérer les amis
  getAmis(): Observable<any> {
    return this.Http.get(`http://localhost:3000/auth/getAmis/${this.id}`,{ withCredentials: true });
  }
   updateLastLogin(UserId: string): Observable<any> {
    return this.Http.post('http://localhost:3000/auth/updateLastLogin', { userId : UserId },{ withCredentials: true });
  }
  // ✅ Ajouter un ami
  addamis(userdata: any): Observable<any> {
    console.log('➕ Ajout ami :', userdata);
    return this.Http.post('http://localhost:3000/auth/addAmis', userdata,{ withCredentials: true });
  }

  // ✅ Envoyer un message
  sendMessage(receiverId: string, data: { text: string }): Observable<any> {
    return this.Http.post(`http://localhost:3000/auth/sendMessage/${receiverId}`, data, {
      withCredentials: true,
    });
  }

  // ✅ Récupérer tous les messages avec un utilisateur donné
  getMessages(selectuserId: string): Observable<any> {
    return this.Http.get(`http://localhost:3000/auth/getAllmsgs/${selectuserId}`, {
      withCredentials: true,
    });
  }

  // ✅ Déconnexion
  logout(): Observable<any> {
    return this.Http.post('http://localhost:3000/auth/logout', { withCredentials: true });
  }

  // ✅ Récupérer profil (optionnel)
  getProfil(): Observable<any> {
    return this.Http.get(`http://localhost:3000/auth/user/${this.id}`,{ withCredentials: true });
  }
  publickey(publicKey:string) : Observable<any>{
    return this.Http.post('http://localhost:3000/auth/me/pubkey',{publicKey},{withCredentials:true});
  }
}
