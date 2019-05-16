import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private citySource = new BehaviorSubject<any>({});
  private cityScore = new BehaviorSubject<any>({});
  public finalScore = this.cityScore.asObservable();
  public currentCities = this.citySource.asObservable();
  private tempMin: number = 70;
  private tempMax: number = 85;

  public setCities(cities: any) {
    this.citySource.next(cities);
  }

  public compareWeather(cities: any): Observable<any> {
    const scores: Cities = {
      cityOne: {
        name: cities.cityOne.location.name,
        temp: cities.cityOne.current.temp_f,
        precip: cities.cityOne.current.precip_in,
        humidity: cities.cityOne.current.humidity,
        score: {
          tempWin: false,
          precipWin: false,
          humidityWin: false,
          total: 0
        },
        winner: false
      },
      cityTwo: {
        name: cities.cityTwo.location.name,
        temp: cities.cityTwo.current.temp_f,
        precip: cities.cityTwo.current.precip_in,
        humidity: cities.cityTwo.current.humidity,
        score: {
          tempWin: false,
          precipWin: false,
          humidityWin: false,
          total: 0
        },
        winner: false
      }
    };

    if (this.withinTempRange(scores.cityOne.temp) && this.withinTempRange(scores.cityTwo.temp)) {
      scores.cityOne.score.total += 1;
      scores.cityTwo.score.total += 1;
      scores.cityOne.score.tempWin = true;
      scores.cityTwo.score.tempWin = true;
    } else if (this.withinTempRange(scores.cityOne.temp) && !this.withinTempRange(scores.cityTwo.temp)) {
      scores.cityOne.score.total += 1;
      scores.cityOne.score.tempWin = true;
    } else if (!this.withinTempRange(scores.cityOne.temp) && !this.withinTempRange(scores.cityTwo.temp)) {
      scores.cityTwo.score.total += 1;
      scores.cityTwo.score.tempWin = true;
    }

    if (scores.cityOne.precip < scores.cityTwo.precip) {
      scores.cityOne.score.precipWin = true;
      scores.cityOne.score.total += 1;
    } else if (scores.cityOne.precip > scores.cityTwo.precip) {
      scores.cityTwo.score.precipWin = true;
      scores.cityTwo.score.total += 1;
    } else {
      scores.cityOne.score.precipWin = true;
      scores.cityTwo.score.precipWin = true;
    }

    if (scores.cityOne.humidity < scores.cityTwo.humidity) {
      scores.cityOne.score.humidityWin = true;
      scores.cityOne.score.total += 1;
    } else if (scores.cityOne.humidity > scores.cityTwo.humidity) {
      scores.cityTwo.score.humidityWin = true;
      scores.cityTwo.score.total += 1;
    } else {
      scores.cityOne.score.humidityWin = true;
      scores.cityTwo.score.humidityWin = true;
    }
    this.cityScore.next(scores);

    return this.finalScore;
  }

  private withinTempRange(temp: number) {
    return temp >= this.tempMin && temp <= this.tempMax;
  }
}
