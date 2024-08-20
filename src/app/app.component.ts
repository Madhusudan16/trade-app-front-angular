import { Component } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cityCountryList : any[] = [];
  permitList : any[] = [];
  pluList : any[] = [];


  constructor(private http: HttpClient, private apollo: Apollo) { }
  title = 'trade-dashboard';
  selectedCountry: any = '';
  selectedPermit: any = '';
  selectedPlu: any = '';
  startDate = '';
  endDate = ''
  data: any[] = [];
  loading = true;
  error: any;

  getData():void{
    console.log(this.selectedPlu, 'permit-----')
    this.apollo
    .watchQuery({
      query: gql`
      query examplaQuery($city: String, $country: String, $permit: String, $plu: String, $startDate: String, $endDate: String) {
        recordmain(city: $city,country: $country, permit: $permit, plu:$plu, startDate: $startDate, endDate: $endDate) {
          city,
          county,
          location_name,
          LitterAssessment,
          Edit_date,
          material_group
        }
      }
      `,
      variables:{
        city: this.selectedCountry && this.selectedCountry.city ? this.selectedCountry.city : '',
        country: this.selectedCountry && this.selectedCountry.county ? this.selectedCountry.county : '',
        permit: this.selectedPermit,
        plu: this.selectedPlu,
        startDate: this.startDate, endDate: this.endDate
    }
    })
    .valueChanges.subscribe((result: any) => {
      console.log(result.data)
      this.data = result?.data?.recordmain;
      this.loading = result.loading;
      this.error = result.error;
    });
  }
  getCityCountry():void{
    console.log('called')
    this.apollo
    .watchQuery({
      query: gql`
      query examplaQuery {
        getCityCountry {
          city,
          county
      }
    }
      `,
    })
    .valueChanges.subscribe((result: any) => {
      console.log(result,'city')
      this.cityCountryList = result?.data?.getCityCountry;
    });
  }
  getPermittee():void{
    this.apollo
    .watchQuery({
      query: gql`
      query examplaQuery {
        getPermittee {
          permittee
        }
    }
      `,
    })
    .valueChanges.subscribe((result: any) => {
      console.log(result)
      this.permitList = result?.data?.getPermittee;
      console.log(this.permitList)
    });
  }
  getPlu():void{
    this.apollo
    .watchQuery({
      query: gql`
      query examplaQuery {
        getPlu {
          plu
        }
    }
      `,
    })
    .valueChanges.subscribe((result: any) => {
      console.log(result)
      this.pluList = result?.data?.getPlu;
    });
  }
  ngOnInit() {
    this.getCityCountry();
    this.getPermittee();
    this.getPlu();
    this.getData();
    // this.http.get("http://localhost:8080/getmain").subscribe(data => {
    //   console.log(data);
    //   this.data = data;

    //   for (let i = 0; i < this.data.length; i++) {

    //     if (this.cityList.indexOf(this.data[i].city) == -1) {
    //       this.cityList.push(this.data[i].city)
    //     }

    //     if (this.countyList.indexOf(this.data[i].county) == -1) {
    //       this.countyList.push(this.data[i].county)
    //     }
    //   }
    // });

  }
  selectedCountryOption(event: any): void{
    this.selectedPermit = '';
  }
  selectedPermiOption(event: any): void{
    this.selectedCountry = '';
  }
  onButtonClick(): void{
    console.log('called');

    this.getData();
  }
  onStartDateChange(event: any): void{
    if(event.target.value){
      this.startDate = moment(event.target.value).format('MM/DD/YYYY')
      console.log('start', this.startDate)
    }else{
      this.startDate = '';
    }
  }
  onEndDateChange(event: any): void{
    if(event.target.value){
    this.endDate = moment(event.target.value).format('MM/DD/YYYY')
    console.log('end', this.endDate)
    }else{
      this.endDate = '';
    }
  }
}
