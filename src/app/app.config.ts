import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseConfig= {
  apiKey: "AIzaSyB5ENrxRU4jbsNq80miUwPIE713eG1tseU",
  authDomain: "siankaan-consultorio.firebaseapp.com",
  projectId: "siankaan-consultorio",
  storageBucket: "siankaan-consultorio.appspot.com",
  messagingSenderId: "607279982857",
  appId: "1:607279982857:web:52068f986d7a8b6a3f8bd8"
}


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp(firebaseConfig)), provideAuth(() => getAuth())]
};