import { Component } from '@angular/core';
import {AppComponent} from '../app.component';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(
    public myapp: AppComponent,
    private route: Router,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    ) {}

  async logout(){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();
    this.storage.remove('session');
    this.storage.remove('jenis');
    this.storage.remove('toko_id');
    loading.dismiss();
    this.route.navigate(['/']);
  }
}
