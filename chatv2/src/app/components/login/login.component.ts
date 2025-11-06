import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  constructor(private api :ApiService , private router: Router){};
      isLogin = true;
      registrationData={};
      formData = {
    firstName: '',
    lastName: '', 
    username: '',
    phone: '',
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
    };
  }
  data={};
      onSubmit() {
        if (this.isLogin) {
          console.log('Connexion avec:', this.formData.email, this.formData.password);
           this.api.connexion(this.formData).subscribe(res=>{
            console.log('connexion reussite 100%', res);
            
            localStorage.setItem('id',res.id);
            this.router.navigate(['/chat']);
           })

        } else {
          this.registrationData = {
      username: this.formData.username,
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      email: this.formData.email,
      phone: this.formData.phone,
      password: this.formData.password
     
    };
          console.log('Inscription:', this.formData);
         

          
          this.api.addUser(this.registrationData).subscribe(res=>{
            console.log('responde de api cest :',res)
            this.showEmailVerification = true;
          });
        
        }
      
      }

      toggleForm() {
        this.isLogin = !this.isLogin;
      }
}
