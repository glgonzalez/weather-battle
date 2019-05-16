import { Component} from '@angular/core';
import { ApiResource } from 'src/services/api-resource/api-resource';
import {WeatherService} from 'src/services/weather/weather-service';
import { FormControl, FormGroup } from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search-cities',
  templateUrl: './search-cities.component.html',
  styleUrls: ['./search-cities.component.css']
})
export class SearchCitiesComponent {
  constructor(private router: Router, private apiResource: ApiResource, private weatherService: WeatherService) {}
  public cityForm: FormGroup = new FormGroup({
    cityOne: new FormControl(),
    cityTwo: new FormControl()
  });
  public cityOneResults: string[];
  public cityTwoResults: string[];
  public cityObject: any = {};

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.cityForm.controls.cityOne.valueChanges
    .subscribe(result => this.apiResource.get('search.json', result)
    .subscribe(response => this.cityOneResults = response));

    this.cityForm.controls.cityTwo.valueChanges
    .subscribe(result => this.apiResource.get('search.json', result)
    .subscribe(response => this.cityTwoResults = response));
  }

  public searchWeather(): any {
    this.apiResource.get('current.json', this.cityForm.controls.cityOne.value)
    .subscribe(data => this.apiResource.get('forecast.json', this.cityForm.controls.cityTwo.value)
    .subscribe(data2 => {
      this.cityObject.cityOne = data;
      this.cityObject.cityTwo = data2;
      this.weatherService.setCities(this.cityObject);
      this.router.navigate(['/results']);
    }));
  }
}
