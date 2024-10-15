import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"siankaan-consultorio","appId":"1:607279982857:web:52068f986d7a8b6a3f8bd8","storageBucket":"siankaan-consultorio.appspot.com","apiKey":"AIzaSyB5ENrxRU4jbsNq80miUwPIE713eG1tseU","authDomain":"siankaan-consultorio.firebaseapp.com","messagingSenderId":"607279982857"})), provideAuth(() => getAuth())]
};
