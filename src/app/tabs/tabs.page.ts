import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  private session='';
  public jenis='';

  constructor(
    private storage: Storage,
    private http: HttpClient,
    ) {
      this.cek_login()
    }

    async cek_login(){
      this.session=await this.storage.get('session');
  
      let parameter={
        "session" : this.session
      }
      this.http.post(`${environment.baseUrl}`+'/get_data',parameter,{})
      .subscribe(data => {
          const response=JSON.parse(JSON.stringify(data))
          if(response.status){
            // console.log(response)
            this.storage.set('toko_id', response.data.toko_id)
            this.storage.set('jenis', response.data.jenis)
            this.jenis=response.data.jenis
          }
        });  
    }

}
