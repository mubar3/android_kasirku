import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KasirPageRoutingModule } from './kasir-routing.module';

import { KasirPage } from './kasir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KasirPageRoutingModule
  ],
  declarations: [KasirPage]
})
export class KasirPageModule {}
