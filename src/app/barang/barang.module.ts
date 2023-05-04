import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BarangPageRoutingModule } from './barang-routing.module';

import { BarangPage } from './barang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BarangPageRoutingModule
  ],
  declarations: [BarangPage]
})
export class BarangPageModule {}
