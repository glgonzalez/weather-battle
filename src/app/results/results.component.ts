import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WeatherService} from 'src/services/weather/weather-service';

interface Cities {
  cityOne: City;
  cityTwo: City;
}

interface City {
  name: string;
  temp: number;
  precip: number;
  humidity: number;
  score: Score;
  winner: boolean;
}

interface Score {
  tempWin: boolean;
  precipWin: boolean;
  humidityWin: boolean;
  total: number;
}

@Component({
  selector: 'results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  private cities: Cities;
  public cityScores: any;
  public winner: City;
  public loser: City;
  public tie: boolean = false;
  public displayedColumns: string[] = ['name', 'temp', 'rain', 'humidity'];
  constructor(private route: ActivatedRoute, private weatherService: WeatherService) {}

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.weatherService.currentCities.subscribe(data => {
      this.cities = data;
    });

    this.weatherService.compareWeather(this.cities).subscribe(scores => {
      if (scores.cityOne.score.total > scores.cityTwo.score.total) {
        this.winner = scores.cityOne;
        this.loser = scores.cityTwo;
      } else if (scores.cityOne.score.total < scores.cityTwo.score.total) {
        this.winner = scores.cityTwo;
        this.loser = scores.cityOne;
      } else {
        this.tie = true;
        this.cityScores = scores;
      }
    });
  }
}
