import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AppComponent} from '../app.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private session='';
  public email=''
  public password=''
  constructor(
    private route: Router,
    public myapp: AppComponent,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    ) {
      this.cek_login() 
    }

  ngOnInit() {
  }

  async cek_login(){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();
    this.session=await this.storage.get('session');
    if(this.session != ''){

      let parameter={
        "session" : this.session
      }
      this.http.post(`${environment.baseUrl}`+'/get_barang_new',parameter,{})
        .subscribe(data => {
          const response=JSON.parse(JSON.stringify(data))
          loading.dismiss();
          if(response.status){
            this.route.navigate(['/dashboard']);
          }
        });  
    }
    loading.dismiss();
  }

  async login(){
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    let parameter={
      "email" : this.email,
      "password" : this.password
    }
    this.http.post(`${environment.baseUrl}`+'/login',parameter,{})
      .subscribe(data => {
        const response=JSON.parse(JSON.stringify(data))
        if(response.status){
          // console.log(response)
          loading.dismiss();
          this.email=''
          this.password=''
          this.storage.set('session', response.token)
          this.route.navigate(['/dashboard']);
        }else{
          loading.dismiss();
          this.myapp.presentAlert2('Data salah');
        }
      });  
  }

}
