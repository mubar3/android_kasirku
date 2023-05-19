import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransaksiPageRoutingModule } from './transaksi-routing.module';

import { TransaksiPage } from './transaksi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransaksiPageRoutingModule
  ],
  declarations: [TransaksiPage]
})
export class TransaksiPageModule {}
