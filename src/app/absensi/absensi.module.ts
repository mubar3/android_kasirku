import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AbsensiPageRoutingModule } from './absensi-routing.module';

import { AbsensiPage } from './absensi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AbsensiPageRoutingModule
  ],
  declarations: [AbsensiPage]
})
export class AbsensiPageModule {}
