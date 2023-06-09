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
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { Camera } from '@ionic-native/camera/ngx';  

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
        IonicModule.forRoot(), 
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        [
          IonicStorageModule.forRoot({
            driverOrder: [Drivers.SecureStorage, Drivers.IndexedDB, Drivers.LocalStorage]
          })
        ],
      ],
  providers: [
    Camera,  
    DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
