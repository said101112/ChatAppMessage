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
      formData = {
      username: '',
      phone: '',
        email: '',
        password: ''
      };

      onSubmit() {
        if (this.isLogin) {
          console.log('Connexion avec:', this.formData.email, this.formData.password);
           this.api.connexion(this.formData).subscribe(res=>{
            console.log('connexion reussite 100%', res);
            localStorage.setItem('id',res.id);
            this.router.navigate(['/chat']);
           })

        } else {
          console.log('Inscription:', this.formData);
          this.api.addUser(this.formData).subscribe(res=>{
            console.log('responde de api cest :',res)
          });
        }
      
      }

      toggleForm() {
        this.isLogin = !this.isLogin;
      }
}
