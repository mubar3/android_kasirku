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
  selector: 'app-transaksi',
  templateUrl: './transaksi.page.html',
  styleUrls: ['./transaksi.page.scss'],
})
export class TransaksiPage implements OnInit {
  public tgl_awal=this.datepipe.transform(new Date(), 'yyyy-MM-dd');
  public tgl_akhir=this.datepipe.transform(new Date(), 'yyyy-MM-dd');
  public datas=([] as any[]);
  public reports=([] as any[]);
  private session='';
  public jenis='';
  public total_harga=0;
  public keuntungan=50;
  public uang_dibawa=0;
  public hasil='';
  public keuntungan_bersih=0;
  public keuntungan_kotor=0;
  public biaya_sewa=0;
  public total_gaji=0;
  public penjualan=0;
  public restok=0;
  public data_karyawan=([] as any[]);
  private toko_id='';
  public tagihan_gaji=0;
  public gaji_sewa=([] as any[]);
  public gaji_karyawan=([] as any[]);
  public id_karyawan=([] as any[]);
  public data_gaji_karyawan=([] as any[]);

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
      this.ngOnInit()  
     }

  ngOnInit() {
    this.hasil=''
    this.reports=[]
    this.cek_login()
    this.open_link()
  }
    
  async cek_login(){
    this.session=await this.storage.get('session');
    this.jenis=await this.storage.get('jenis');
    this.toko_id=await this.storage.get('toko_id');
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
    this.http.post(`${environment.baseUrl}`+'/get_transaksi',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          this.total_harga=0
          Object.keys(response.data).forEach((elt, index)=>{
            this.total_harga=this.total_harga + ( response.data[elt]['total_harga'] )
          })
          
          loading.dismiss();
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

  

  set_date(value:any){
    this.tgl_awal=value.value.awal
    this.tgl_akhir=value.value.akhir
    // console.log(this.tgl_awal)
    this.open_link()
  }

  async report(){
    this.datas=[]
    this.reports=[]
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "session" : this.session,
      "tanggal_awal" : this.tgl_awal,
      "tanggal_akhir" : this.tgl_akhir,
      "keuntungan" : this.keuntungan,
    }
    this.http.post(`${environment.baseUrl}`+'/report',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          // console.log(response)
          this.hasil=response.hasil
          this.penjualan=response.penjualan
          this.restok=response.restok
          this.keuntungan_bersih=response.keuntungan_bersih
          this.keuntungan_kotor=response.keuntungan_kotor
          this.biaya_sewa=response.biaya_sewa
          this.total_gaji=response.total_gaji
          this.data_karyawan=response.data_karyawan
          loading.dismiss();
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
      }); 
  }
  
  async save_report(){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "session" : this.session,
      'tgl_awal' : this.tgl_awal,
      'tgl_akhir' : this.tgl_akhir,
      'status' : this.hasil,
      'keuntungan_kotor' : this.keuntungan_kotor,
      'keuntungan_bersih' : this.keuntungan_bersih,
      'total_penjualan' : this.penjualan,
      'restok' : this.restok,
      'gaji_sewa' : this.total_gaji + this.biaya_sewa,
      'total_gaji' : this.total_gaji,
      'biaya_sewa' : this.biaya_sewa,
      'karyawan' : JSON.stringify(this.data_karyawan),
    }
    this.http.post(`${environment.baseUrl}`+'/save_report',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          loading.dismiss();
          this.myapp.presentToast_copy('bottom','Berhasil Simpan')
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
      });  
  }

  async get_report(){
    this.hasil=''
    this.datas=[]
    this.gaji_karyawan=[]
    this.id_karyawan=[]
    this.data_gaji_karyawan=[]
    this.tagihan_gaji=0
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "session" : this.session,
      "tgl_awal" : this.tgl_awal,
      "tgl_akhir" : this.tgl_akhir,
      "toko_id" : this.toko_id,
    }
    this.http.post(`${environment.baseUrl}`+'/get_report',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          Object.keys(response.data).forEach((elt, index)=>{
            this.gaji_sewa[response.data[elt]['id']]=Number(response.data[elt]['total_gaji']) + Number(response.data[elt]['biaya_sewa'])
            // console.log(response)
            Object.keys(response.data[elt]['karyawan']).forEach((elt2, index)=>{
              if(response.data[elt]['karyawan'][elt2]['bayar'] == 'n'){
                  if(this.gaji_karyawan.hasOwnProperty(this.gaji_karyawan[response.data[elt]['karyawan'][elt2]['name']])){
                    this.gaji_karyawan[response.data[elt]['karyawan'][elt2]['user_id']]=Number(this.gaji_karyawan[response.data[elt]['karyawan'][elt2]['user_id']])+response.data[elt]['karyawan'][elt2]['jumlah']
                  }else{
                    this.gaji_karyawan[response.data[elt]['karyawan'][elt2]['user_id']]=response.data[elt]['karyawan'][elt2]['jumlah']
                  }
                  this.id_karyawan[response.data[elt]['karyawan'][elt2]['user_id']]=response.data[elt]['karyawan'][elt2]['name']
                  this.tagihan_gaji+=Number(response.data[elt]['karyawan'][elt2]['jumlah'])
              }
            })
          })
          var urut=0
          for (const [key, value] of Object.entries(this.gaji_karyawan)) {
              const cek={
                'id' : key,
                'nama' : this.id_karyawan[Number(key)],
                'gaji' : value
              }
              this.data_gaji_karyawan[urut]=cek
              urut=urut+1
          }
          // console.log(this.data_gaji_karyawan)
          this.reports=response.data
          loading.dismiss();
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
      }); 
  }

  

  async alert_delreport(id:any){
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
            this.del_report(id)
            // console.log('Yes clicked');
          }
        }]
    });
    await alert.present();
  }
  
  async del_report(id:any){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "session" : this.session,
      'id_report' : id,
    }
    this.http.post(`${environment.baseUrl}`+'/del_report',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          loading.dismiss();
          this.myapp.presentToast_copy('bottom','Berhasil Hapus Report')
          this.get_report()
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
      });  
  }

  async bayarkan(id:any,jenis:any){
    const alert = await this.alertController.create({
      header: 'Alert',
      // subHeader: 'Invalid number!',
      message: 'Yakin sudah dibayar?',
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
            this.bayar(id,jenis)
            // console.log('Yes clicked');
          }
        }]
    });
    await alert.present();
  }

  

  async bayarkan_date(id:any,jenis:any){
    const alert = await this.alertController.create({
      header: 'Alert',
      // subHeader: 'Invalid number!',
      message: 'Yakin sudah dibayar?',
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
            this.bayar_date(id,jenis)
            // console.log('Yes clicked');
          }
        }]
    });
    await alert.present();
  }
  
  async bayar_date(id:any,jenis:any){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "session" : this.session,
      'id_karyawan' : id,
      'tgl_awal' : this.tgl_awal,
      'tgl_akhir' : this.tgl_akhir,
      'jenis' : jenis,
    }
    this.http.post(`${environment.baseUrl}`+'/endis_gaji_date',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          loading.dismiss();
          this.myapp.presentToast_copy('bottom','Berhasil Penggajian')
          this.get_report()
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
      });  
  }

  async batal_bayarkan(id:any,jenis:any){
    const alert = await this.alertController.create({
      header: 'Alert',
      // subHeader: 'Invalid number!',
      message: 'Yakin belum dibayar?',
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
            this.bayar(id,jenis)
            // console.log('Yes clicked');
          }
        }]
    });
    await alert.present();
  }
  
  async bayar(id:any,jenis:any){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "session" : this.session,
      'id_gajireport' : id,
      'jenis' : jenis,
    }
    this.http.post(`${environment.baseUrl}`+'/endis_gaji',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          loading.dismiss();
          this.myapp.presentToast_copy('bottom','Berhasil Penggajian')
          this.get_report()
        }else{
          loading.dismiss();
          this.myapp.presentAlert2(JSON.stringify(response.message));
        }
      },error=>{
        loading.dismiss();
        this.myapp.presentAlert2('eror');
      });  
  }

}
