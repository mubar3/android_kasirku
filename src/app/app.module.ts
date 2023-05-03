import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
        IonicModule.forRoot(), 
        AppRoutingModule,
        HttpClientModule,
        [
          IonicStorageModule.forRoot({
            driverOrder: [Drivers.SecureStorage, Drivers.IndexedDB, Drivers.LocalStorage]
          })
        ],
      ],
  providers: [
    DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
