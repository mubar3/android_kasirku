import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {AppComponent} from '../app.component';
import { LoadingController} from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { AlertController} from '@ionic/angular';

@Component({
  selector: 'app-barang',
  templateUrl: './barang.page.html',
  styleUrls: ['./barang.page.scss'],
})
export class BarangPage implements OnInit {
  private session='';
  private toko_id='';
  public status=false;
  public datas_barang=([] as any[]);
  public jumlah_datas=0;
  public nama='';
  public harga='';
  public stok='';
  public id_update=([] as any[]);
  public nama_update=([] as any[]);
  public harga_update=([] as any[]);
  public stok_update=([] as any[]);

  constructor(
    private storage: Storage,
    private http: HttpClient,
    public myapp: AppComponent,
    private loadingCtrl: LoadingController,
    public datepipe: DatePipe,
    private alertController: AlertController,
    ) {
      this.cek_login()
      this.open_link()
     }

  ngOnInit() {
  }

  async cek_login(){
    this.session=await this.storage.get('session');
    this.toko_id=await this.storage.get('toko_id');
  }
  
  async open_link(){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "session" : this.session,
      "tanggal_awal" : this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
      "tanggal_akhir" : this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
    }
    this.http.post(`${environment.baseUrl}`+'/get_barangall',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          Object.keys(response.data).forEach((elt, index)=>{
              this.nama_update[index] = response.data[elt]['nama'] ;
              this.harga_update[index] = response.data[elt]['harga'] ;
              this.stok_update[index] = response.data[elt]['stok'] ;
              this.id_update[index] = response.data[elt]['id'] ;
              this.jumlah_datas++
          })
          loading.dismiss();
          this.datas_barang=response.data
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
      });  
  }

  async enable_barang(id:any){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "session" : this.session,
      "barang_id" : id,
      "status" : "y",
    }
    this.http.post(`${environment.baseUrl}`+'/status_barang',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          loading.dismiss();
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
        this.open_link()
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
        this.open_link()
      }); 
  }
  
  async disable_barang(id:any){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "session" : this.session,
      "barang_id" : id,
      "status" : "n",
    }
    this.http.post(`${environment.baseUrl}`+'/status_barang',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          loading.dismiss();
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
        this.open_link()
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
        this.open_link()
      }); 
  }

  async tambah_barang(){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "session" : this.session,
      "toko_id" : this.toko_id,
      "nama" : this.nama,
      "harga" : this.harga,
      "stok" : this.stok,
    }
    this.http.post(`${environment.baseUrl}`+'/add_barang',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          loading.dismiss();
          this.nama=''
          this.harga=''
          this.stok=''
          this.myapp.presentToast_copy('bottom','Berhasil tambah')
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
        this.open_link()
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
        this.open_link()
      }); 

  }

  async alert_barang(id:any){
    const alert = await this.alertController.create({
      header: 'Alert',
      // subHeader: 'Invalid number!',
      message: 'Data akan dihapus?',
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
            this.hapus_barang(id)
            // console.log('Yes clicked');
          }
        }]
    });
    await alert.present();
  }

  async hapus_barang(id:any){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "session" : this.session,
      "barang_id" : id,
    }
    this.http.post(`${environment.baseUrl}`+'/hapus_barang',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          loading.dismiss();
          this.myapp.presentToast_copy('bottom','Berhasil dihapus')
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
        this.open_link()
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
        this.open_link()
      }); 
  }  

  async alert_update(value:any,i:any,barang_id:any){
    // console.log(value.value)
    const alert = await this.alertController.create({
      header: 'Alert',
      // subHeader: 'Invalid number!',
      message: 'Data akan diupdate?',
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
            this.update_barang(barang_id, value.value.name, value.value.harga, value.value.stok)
            // console.log('Yes clicked');
          }
        }]
    });
    await alert.present();
  }

  async update_barang(barang_id:any,name:any,harga:any,stok:any){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "session" : this.session,
      "barang_id" : barang_id,
      "nama" : name,
      "harga" : harga,
      "stok" : stok,
    }
    this.http.post(`${environment.baseUrl}`+'/edit_barang',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          loading.dismiss();
          this.myapp.presentToast_copy('bottom','Berhasil diupdate')
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
        this.open_link()
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
        this.open_link()
      }); 
  }  
}
