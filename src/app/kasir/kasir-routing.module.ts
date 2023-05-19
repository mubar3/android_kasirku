import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KasirPage } from './kasir.page';

const routes: Routes = [
  {
    path: '',
    component: KasirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KasirPageRoutingModule {}
