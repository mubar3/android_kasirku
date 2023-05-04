import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BarangPage } from './barang.page';

const routes: Routes = [
  {
    path: '',
    component: BarangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarangPageRoutingModule {}
