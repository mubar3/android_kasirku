import { Component } from '@angular/core';
import {AppComponent} from '../app.component';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AlertController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public email=''
  private session=''

  constructor(
    public myapp: AppComponent,
    private route: Router,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private alertController: AlertController,
    private http: HttpClient,
    // private inAppBrowser: InAppBrowser,
    ) {
      this.oninit()
    }

  async oninit(){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    this.session=await this.storage.get('session')
    this.email=await this.storage.get('email')

    loading.dismiss();
  }



  async alert_data(){
    const alert = await this.alertController.create({
      header: 'Edit data',
      // subHeader: 'Invalid number!',
      // message: 'Yakin tambah penjualan '+barang+' ?',
      inputs: [
        {
            name: 'email',
            type: 'text',
            placeholder:"Email",
            value: this.email,
        },
        {
            name: 'password_lama',
            type: 'text',
            placeholder:"Password lama",
        },
        {
            name: 'password',
            type: 'text',
            placeholder:"Password baru",
        }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Update',
          handler: (alertData) => {
            this.edit_data(alertData.email,alertData.password_lama,alertData.password)
            // console.log(alertData);
          }
        }]
    });
    await alert.present();
  }

  async edit_data(email:any,password_lama:any,password:any){

    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "session" : this.session,
      "email" : email,
      "password" : password,
      "password_lama" : password_lama,
    }
    this.http.post(`${environment.baseUrl}`+'/ubah_data',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          loading.dismiss();
          this.myapp.presentToast_copy('bottom','Berhasil ubah data')
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
      });
  }

  async logout(){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "session" : this.session,
    }
    this.http.post(`${environment.baseUrl}`+'/logout',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          loading.dismiss();
          this.storage.remove('session');
          this.storage.remove('jenis');
          this.storage.remove('toko_id');
          loading.dismiss();
          this.myapp.presentToast_copy('bottom','Berhasil Logout')
          this.route.navigate(['/']);
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
      });

  }

  resep(){
    window.open('https://drive.google.com/file/d/1IQoP_ubTQpZ1J2H4kb3CDKS77kjHDx4Q/view?usp=sharing');
    // const filePath = 'https://drive.google.com/file/d/1IQoP_ubTQpZ1J2H4kb3CDKS77kjHDx4Q/view?usp=sharing'; // Lokasi file PDF di dalam proyek
    // cordova.plugins.pdfViewer.showPdf(filePath, { landscape: 'landscape', enableThumbs: false });
    // const url = 'https://drive.google.com/file/d/1IQoP_ubTQpZ1J2H4kb3CDKS77kjHDx4Q/view?usp=sharing'; // Ganti dengan URL PDF Anda
    // const browser = this.inAppBrowser.create(url, '_blank');
    // this.iab.create(`https://bawana-cahaya-abadi.com/rfid/`, `_blank`, 'location=no,zoom=no,toolbar=no');

  }
}
