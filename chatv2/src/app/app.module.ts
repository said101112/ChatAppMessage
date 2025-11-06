import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ChatComponent } from './components/chat/chat.component';
import {  HttpClientModule , HTTP_INTERCEPTORS} from '@angular/common/http';
import {InterceptorService} from './interceptor.service'
import { SidebarComponent } from './components/chat/sidebar/sidebar.component';
import { ListConversationComponent } from './components/chat/list-conversation/list-conversation.component';
import { ErrorComponent } from './components/error/error.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { BorderAnimComponent } from './components/children/border-anim/border-anim.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    SidebarComponent,
    ListConversationComponent,
    ErrorComponent,
    LoaderComponent,
    BorderAnimComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [{provide:HTTP_INTERCEPTORS,useClass:InterceptorService,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
