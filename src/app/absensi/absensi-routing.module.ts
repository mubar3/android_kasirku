import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AbsensiPage } from './absensi.page';

const routes: Routes = [
  {
    path: '',
    component: AbsensiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbsensiPageRoutingModule {}
