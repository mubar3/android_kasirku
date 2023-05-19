import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'dash1',
    loadChildren: () => import('./utama/tab1.module').then(m => m.Tab1PageModule)
  },
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'barang',
    loadChildren: () => import('./barang/barang.module').then( m => m.BarangPageModule)
  },
  {
    path: 'kasir',
    loadChildren: () => import('./kasir/kasir.module').then( m => m.KasirPageModule)
  },
  {
    path: 'transaksi',
    loadChildren: () => import('./transaksi/transaksi.module').then( m => m.TransaksiPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
