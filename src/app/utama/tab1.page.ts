import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoadingController} from '@ionic/angular';
import { DatePipe } from '@angular/common';
import {AppComponent} from '../app.component';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AlertController} from '@ionic/angular';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public datas=([] as any[]);
  public minus=0;
  public add=0;
  public total=0;
  // public storage_get='';
  private session='';
  public jenis='';
  public cari_barang='';
  // public tgl_awal='';
  // public tgl_akhir='';
  public tgl_awal=this.datepipe.transform(new Date(), 'yyyy-MM-dd');
  public tgl_akhir=this.datepipe.transform(new Date(), 'yyyy-MM-dd');
  // public nama='';
  constructor(
    private http: HttpClient,
    public datepipe: DatePipe,
    private loadingCtrl: LoadingController,
    public myapp: AppComponent,
    private route: Router,
    private storage: Storage,
    private alertController: AlertController,
    ) {
    this.cek_login()
    this.open_link()
  }
  
  async cek_login(){
    this.session=await this.storage.get('session');
    this.jenis=await this.storage.get('jenis');
    // console.log(this.jenis)
    if(this.session != ''){

      let parameter={
        "session" : this.session
      }
      this.http.post(`${environment.baseUrl}`+'/get_barang_new',parameter,{})
      .subscribe(data => {
          const response=JSON.parse(JSON.stringify(data))
          if(!response.status){
            this.route.navigate(['/']);
          }
        });  
    }else{
        this.route.navigate(['/']);
    }
  }

  set_date(value:any){
    this.tgl_awal=value.value.awal
    this.tgl_akhir=value.value.akhir
    // console.log(this.tgl_awal)
    this.open_link()
  }
  
  async open_link(){
    this.jenis=await this.storage.get('jenis');
    // const headers = {
    //   'Content-Type': 'application/json',
    //   'secretkey': 'xxx',
    //   'Access-Control-Allow-Origin' : '*',
    //   'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
    //   'Accept' : 'application/json',
    // }
    // const options = {  headers:headers, withCredintials: true};
    // this.http.post(`${environment.baseUrl}`+'/get_barang',{},option)
    // this.http.get(`${environment.baseUrl}`+'/get_barang')

    
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "session" : this.session,
      "tanggal_awal" : this.tgl_awal,
      "tanggal_akhir" : this.tgl_akhir,
      "cari" : this.cari_barang,
    }
    this.penjualan();
    this.http.post(`${environment.baseUrl}`+'/get_barang_new',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          loading.dismiss();
          // console.log(response.data)
          this.datas=response.data
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
      });  
  }

  penjualan(){
    let parameter={
      "session" : this.session,
      "tanggal_awal" : this.tgl_awal,
      "tanggal_akhir" : this.tgl_akhir,
    }
    this.http.post(`${environment.baseUrl}`+'/detail_penjualan_new',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          this.add=response.tambah
          this.minus=response.kurang
          this.total=response.total
        }else{
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
      },error=>{
        this.myapp.presentAlert2('eror');
      });  
  }

  async alert_tambah(id:any,barang:any){
    const alert = await this.alertController.create({
      header: 'Tambah Penjualan',
      // subHeader: 'Invalid number!',
      message: 'Yakin tambah penjualan '+barang+' ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            // this.tambah(id)
            this.tambah_storage(id)
            // console.log('Yes clicked');
          }
        }]
    });
    await alert.present();
  }

  async tambah(id:any){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();
    
    let parameter={
      "session" : this.session,
      "barang_id" : id,
    }
    this.http.post(`${environment.baseUrl}`+'/add_stok',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          loading.dismiss();
          this.open_link();
          this.myapp.presentToast_copy('bottom','Berhasil tambah')
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
      });  
  }

  async tambah_storage(id:any){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    this.storage.set('kasir_barang['+id+']',await this.storage.get('kasir_barang['+id+']') + 1)
    loading.dismiss();
  }

  async alert_kurang(id:any,barang:any){
    const alert = await this.alertController.create({
      header: 'Kurang Penjualan',
      // subHeader: 'Invalid number!',
      message: 'Yakin kurang penjualan '+barang+' ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            // this.kurang(id)
            this.kurang_storage(id)
            // console.log('Yes clicked');
          }
        }]
    });
    await alert.present();
  }

  async kurang(id:any){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();
    
    let parameter={
      "session" : this.session,
      "barang_id" : id,
    }
    this.http.post(`${environment.baseUrl}`+'/remove_stok',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          loading.dismiss();
          this.open_link();
          this.myapp.presentToast_copy('bottom','Berhasil kurang')
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
      });  

  }

  async kurang_storage(id:any){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    this.storage.set('kasir_barang['+id+']',await this.storage.get('kasir_barang['+id+']') - 1)
    loading.dismiss();
  }

}
