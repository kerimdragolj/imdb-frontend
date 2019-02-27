import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ToastrModule } from 'ngx-toastr';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { HeaderComponent } from './components/header/header.component';

import { UsersService } from './services/users.service';
import { MoviesService } from './services/movies.service';
import { ShowsService } from './services/shows.service';
import { GenresService } from './services/genres.service';
import { ActorsService } from './services/actors.service';
import { RatingService } from './services/rating.service';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    TruncateModule,
    ModalModule.forRoot()
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    RegistrationComponent,
    HeaderComponent
  ],
  providers: [
    UsersService,
    MoviesService,
    ShowsService,
    GenresService,
    ActorsService,
    RatingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
