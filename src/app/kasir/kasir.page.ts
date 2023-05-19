import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoadingController} from '@ionic/angular';
import { DatePipe } from '@angular/common';
import {AppComponent} from '../app.component';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AlertController} from '@ionic/angular';

@Component({
  selector: 'app-kasir',
  templateUrl: './kasir.page.html',
  styleUrls: ['./kasir.page.scss'],
})
export class KasirPage implements OnInit {
  public tgl_awal=this.datepipe.transform(new Date(), 'yyyy-MM-dd');
  public tgl_akhir=this.datepipe.transform(new Date(), 'yyyy-MM-dd');
  private session='';
  public nama='';
  public jenis='';
  public total_harga=0;
  public datas=([] as any[]);
  public penjualan_barang=([] as any[]);
  public harga_barang=([] as any[]);
  public data_simpan=([] as any[]);

  constructor(
    private http: HttpClient,
    public datepipe: DatePipe,
    private loadingCtrl: LoadingController,
    public myapp: AppComponent,
    private route: Router,
    private storage: Storage,
    private alertController: AlertController,
    ) { 
      this.ngOnInit()  
    }
    
    ngOnInit() {
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

  async set_penjualan_barang(id:any){
    this.penjualan_barang[id] = await this.storage.get('kasir_barang['+id+']')
    this.hitung_harga()
    // console.log(this.total_harga)
  }

  hitung_harga(){
    let harga_barang=this.harga_barang
    let total_harga=0;
    this.penjualan_barang.forEach(function (value,index) {
      // console.log(value)
      if(value > 0){
        total_harga=total_harga + (value * harga_barang[index])
      }
    })
    this.total_harga=total_harga
  }
  
  async open_link(){
    this.jenis=await this.storage.get('jenis');

    
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "session" : this.session,
      "tanggal_awal" : this.tgl_awal,
      "tanggal_akhir" : this.tgl_akhir,
    }
    this.http.post(`${environment.baseUrl}`+'/get_barang_new',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          Object.keys(response.data).forEach((elt, index)=>{
            this.set_penjualan_barang(response.data[elt]['id'])
            this.harga_barang[response.data[elt]['id']]=response.data[elt]['harga']
          })
          
          // this.hitung_harga()
          loading.dismiss();
          // console.log(this.total_harga)
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

  async tambah_storage(id:any){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    this.storage.set('kasir_barang['+id+']',await this.storage.get('kasir_barang['+id+']') + 1)
    this.ngOnInit()  
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

  async kurang_storage(id:any){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    this.storage.set('kasir_barang['+id+']',await this.storage.get('kasir_barang['+id+']') - 1)
    this.ngOnInit()  
    loading.dismiss();
  }

  async alert_simpan(){
    let data_simpan=this.data_simpan;
    data_simpan=[];
    this.penjualan_barang.forEach(function (value,index) {
      if(value > 0){
        data_simpan.push({id: index, banyak: value})
      }
    })
    
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();
    
    let parameter={
      "session" : this.session,
      "nama" : this.nama,
      "barang" : JSON.stringify(data_simpan),
    }
    this.http.post(`${environment.baseUrl}`+'/pembelian',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){

          this.del_storage_pembelian()
          this.nama=''
          this.total_harga=0
          this.penjualan_barang=[]
          this.harga_barang=[]
          this.ngOnInit()  
          console.log(this.penjualan_barang)
          loading.dismiss();
          this.myapp.presentToast_copy('bottom','Berhasil simpan')
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
      });  
  }

  async del_storage_pembelian(){
    let parameter={
      "session" : this.session,
      "tanggal_awal" : this.tgl_awal,
      "tanggal_akhir" : this.tgl_akhir,
    }
    this.http.post(`${environment.baseUrl}`+'/get_barang_new',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          Object.keys(response.data).forEach((elt, index)=>{
            this.del_storage_pem(response.data[elt]['id'])
          })
          
        }else{
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
      },error=>{
        this.myapp.presentAlert2('eror');
      }); 
  }

  async del_storage_pem(id:any){
    this.storage.remove('kasir_barang['+id+']')
  }

}
