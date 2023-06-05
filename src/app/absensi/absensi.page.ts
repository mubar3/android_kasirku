import { Component, OnInit } from '@angular/core';import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoadingController} from '@ionic/angular';
import { DatePipe } from '@angular/common';
import {AppComponent} from '../app.component';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AlertController} from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';  

@Component({
  selector: 'app-absensi',
  templateUrl: './absensi.page.html',
  styleUrls: ['./absensi.page.scss'],
})
export class AbsensiPage implements OnInit { 
  
  public capturedSnapURL='';  
  
  cameraOptions: CameraOptions = {  
    quality: 20,  
    destinationType: this.camera.DestinationType.DATA_URL,  
    encodingType: this.camera.EncodingType.JPEG,  
    mediaType: this.camera.MediaType.PICTURE,
    cameraDirection: this.camera.Direction.FRONT
  };  
  
  public tgl_awal=this.datepipe.transform(new Date(new Date().getTime()  - (7*(24*60*60*1000))), 'yyyy-MM-dd');
  public tgl_akhir=this.datepipe.transform(new Date(), 'yyyy-MM-dd');
  private session='';
  public jenis='';
  public datas=([] as any[]);

  constructor(
    private camera: Camera,
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
    this.http.post(`${environment.baseUrl}`+'/get_absen',parameter,{})
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

  async absen(){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "session" : this.session,
      "tanggal" : this.tgl_akhir,
      "status" : "masuk",
      "foto" : this.capturedSnapURL,
    }
    this.http.post(`${environment.baseUrl}`+'/add_absensi',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          this.ngOnInit()  
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
  
  takeSnap() {  
    this.camera.getPicture(this.cameraOptions).then((imageData) => {  
      // this.camera.DestinationType.FILE_URI gives file URI saved in local  
      // this.camera.DestinationType.DATA_URL gives base64 URI  
  
      const base64Image = 'data:image/jpeg;base64,' + imageData;  
      this.capturedSnapURL = base64Image;
      this.absen()  
      // console.log(base64Image)
    }, (err) => {  
  
      console.log(err);  
      // Handle error  
    });  
  }  

}
