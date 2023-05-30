import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    // path: 'tabs',
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../utama/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../barang/barang.module').then(m => m.BarangPageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../about/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'kasir',
        loadChildren: () => import('../kasir/kasir.module').then(m => m.KasirPageModule)
      },
      {
        path: 'transaksi',
        loadChildren: () => import('../transaksi/transaksi.module').then(m => m.TransaksiPageModule)
      },
      {
        path: 'absensi',
        loadChildren: () => import('../absensi/absensi.module').then(m => m.AbsensiPageModule)
      },
      {
        path: '',
        redirectTo: '/dashboard/tab1',
        pathMatch: 'full'
      }
    ]
  },
  // {
  //   path: '',
  //   redirectTo: '/tabs/tab1',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
