import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiResource {
  private apiKey: string = '?key=34daadb9d7c94378b6b02618190805&q=';
  private apiUrl: string = `https://cors-anywhere.herokuapp.com/https://api.apixu.com/v1/`;
  constructor(private http: HttpClient) {}

  get(endpoint: string, request: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + endpoint + this.apiKey + request).pipe(tap(data => {

    }), catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    return throwError(err.error);
  }
}
