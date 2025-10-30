import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';

import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { CryptoService } from '../../service/crypto.service';
import localforage from 'localforage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  constructor(private api :ApiService , private router: Router ,private crypto:CryptoService){};
      isLogin = true;
      registrationData={};
      formData = {
    firstName: '',
    lastName: '', 
    username: '',
    phone: '',
    confirmPassword: '',
    email: '',
    password: ''
  };
   showResetPassword = false;
   showEmailVerification = false;
    resendVerificationEmail() {
    
  }
 onResetPassword() {
    console.log('Reset password for:', this.resetData.email);
    // Ici vous enverriez la requête de reset
    alert(`Un lien de réinitialisation a été envoyé à ${this.resetData.email}`);
    this.showResetPassword = false;
  }
 resetData = {
    email: ''
  };
  
resetForm() {
    this.formData = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    };
  }
  data={};
async onSubmit() {
  if (this.isLogin) {
    console.log('Connexion avec:', this.formData.email, this.formData.password);

    try {
      
      const res = await firstValueFrom(this.api.connexion(this.formData));
      console.log('Connexion réussie !', res);

     
      let privKey = await this.crypto.getPrivateKey();
      let pubKey = await this.crypto.getPublicKey();

      // 3️⃣ Si pas de clé privée ou publique → générer la paire de clés
      if (!privKey || !pubKey) {
        const keys = await this.crypto.genererPaireDeCles();
        privKey = keys.privee;
        pubKey = keys.publique;
        console.log('Nouvelle paire de clés générée :', pubKey);
      } else {
        console.log('Clé publique existante :', pubKey);
      }

      // 4️⃣ Envoyer la clé publique au serveur
      try {
        const resPub = await firstValueFrom(this.api.publickey(pubKey as string));
        console.log('Réponse serveur pour la clé publique :', resPub);
      } catch (err) {
        console.error('Erreur lors de l’envoi de la clé publique :', err);
      }

     
      localStorage.setItem('id', res.id);

     
      this.router.navigate(['/chat']);

    } catch (err) {
      console.error('Erreur lors de la connexion :', err);
      alert('Erreur lors de la connexion, vérifiez vos identifiants ou votre connexion au serveur.');
    }

  } else {
    // Cas inscription
    if (this.formData.password !== this.formData.confirmPassword) {
      alert('Les mots de passe ne sont pas identiques !');
      return;
    }

    const registrationData = {
      username: this.formData.username,
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      email: this.formData.email,
      phone: this.formData.phone,
      password: this.formData.password
    };

    try {
      const res = await firstValueFrom(this.api.addUser(registrationData));
      console.log('Inscription réussie :', res);
      this.showEmailVerification = true;
    } catch (err) {
      console.error('Erreur lors de l’inscription :', err);
      alert('Erreur lors de l’inscription, réessayez plus tard.');
    }
  }
}




      toggleForm() {
        this.isLogin = !this.isLogin;
      }
}
