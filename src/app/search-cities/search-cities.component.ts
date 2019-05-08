import { Component } from '@angular/core';
import { WeatherService } from 'src/services/weather/weather.service';
import {MatDialog} from '@angular/material';
import {ResultDialogComponent} from '../results/results-dialog.component';

@Component({
  selector: 'app-search-cities',
  templateUrl: './search-cities.component.html',
  styleUrls: ['./search-cities.component.css']
})
export class SearchCitiesComponent {
  constructor(private weatherService: WeatherService, public dialog: MatDialog) {}
  public cityOne: string;
  public cityTwo: string;
  private optimalTempMin = 70;
  private optimalTemMax = 80;
  public winner: any;
  public loser: any;
  public tie: boolean = false;
  private score1: number = 0;
  private score2: number = 0;

  public async onSubmit(): Promise<void> {
    this.weatherService.getWeather(this.cityOne).subscribe(w => {
      this.weatherService.getWeather(this.cityTwo).subscribe(async (w2) => {
        await this.determineVictor(w, w2);
        this.showResults();
      });
    });
  }

  private showResults(): void {
    const dialogRef = this.dialog.open(ResultDialogComponent, {
      width: '500px',
      data: {
        winner: this.winner,
        loser: this.loser,
        tie: this.tie
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      window.location.reload();
    });
  }

  private async determineVictor(city1, city2) {
    await this.bestTemp(city1, city2);
    await this.compareRain(city1, city2);
    await this.compareHumidity(city1, city2);

    if (this.score1 > this.score2) {
      this.winner = city1;
      this.loser = city2;
    } else if (this.score1 < this.score2) {
      this.winner = city2;
      this.loser = city1;
    } else {
      this.tie = true;
    }
  }

  private compareHumidity(city1, city2) {
    if (city1.current.humidity < city2.current.humidity) {
      this.score1++;
    } else if (city1.current.humidity > city2.current.humidity) {
      this.score2++;
    }
  }

  private compareRain(rainChance1, rainChance2) {
    if (rainChance1.current.precip_in < rainChance2.current.precip_in) {
      this.score1++;
    } else if (rainChance1.current.precip_in > rainChance2.current.precip_in) {
      this.score2++;
    }
  }

  private bestTemp(temp1, temp2) {
    if (this.withinOptimalTemp(temp1.current.temp_f) && !this.withinOptimalTemp(temp2.current.temp_f)) {
      this.score1++;
    } else if (!this.withinOptimalTemp(temp1.current.temp_f) && this.withinOptimalTemp(temp2.current.temp_f)) {
      this.score2++;
    }
  }

  private withinOptimalTemp(temp): boolean {
    return temp > this.optimalTempMin && temp < this.optimalTemMax;
  }
}
