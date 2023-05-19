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
  private session='';
  public jenis='';

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

}
