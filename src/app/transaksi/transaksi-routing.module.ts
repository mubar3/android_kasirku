import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransaksiPage } from './transaksi.page';

const routes: Routes = [
  {
    path: '',
    component: TransaksiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransaksiPageRoutingModule {}
