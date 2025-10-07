import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError ,finalize  } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoadingService } from './shared/loading.service';
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private router:Router , private load:LoadingService) { }

  intercept(req:HttpRequest<any>,next:HttpHandler) : Observable<HttpEvent<any>>{
  this.load.show();
    const cloned = req.clone({
      withCredentials: true
    });
    
     
    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
         if (error.status) {
          switch (error.status) {
            case 401:
              this.router.navigate(['/error', 401]);
              break;
            case 403:
              this.router.navigate(['/error', 403]);
              break;
            case 404:
              this.router.navigate(['/error', 404]);
              break;
            case 500:
              this.router.navigate(['/error', 500]);
              break;
            default:
              this.router.navigate(['/error', 'unknown']);
              break;
          }
        }
        return throwError(() => error);
      }),
       finalize(() => {
        this.load.hide();
      })
    );
   
  }
}
