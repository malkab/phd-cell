import 'zone.js/dist/zone';
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/router';
import '@angular/http';
import '@angular/forms';
import 'rxjs';
import 'reflect-metadata'

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

document.body.appendChild(document.createElement("app-root"));

platformBrowserDynamic().bootstrapModule(AppModule);
