import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private storage: Storage,
    ) {
      this.init()
    }

  async init() {
    const storage = await this.storage.create();
  }
  
  // public  set(key: string, value: any) {
  //   this._storage?.set(key, value);
  // }

  public set_storage(settingName:any,value:any){
    return this.storage.set(`setting:${ settingName }`,value);
  }
  public async get_storage(settingName:any){
    return await this.storage.get(`setting:${ settingName }`);
  }
  public async remove_storage(settingName:any){
    return await this.storage.remove(`setting:${ settingName }`);
  }
  public clear_storage() {
    this.storage.clear().then(() => {
      console.log('all keys cleared');
    });
  }

  async presentAlert2(text:any) {
    const alert = await this.alertController.create({
      header: 'Alert',
      // subHeader: 'Invalid number!',
      message: text,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentToast_copy(position: 'top' | 'middle' | 'bottom',text:any) {
    const toast = await this.toastController.create({
      message: text,
      duration: 1500,
      position: position
    });

    await toast.present();
  }
}
