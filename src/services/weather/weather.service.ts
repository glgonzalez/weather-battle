import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private getWeatherUrl: string = 'https://cors-anywhere.herokuapp.com/https://api.apixu.com/v1/current.json?key=34daadb9d7c94378b6b02618190805&q=';
  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.get<any>(this.getWeatherUrl + city).pipe(
      tap(data => JSON.stringify(data)),
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
    return throwError(err.error);
  }
}
