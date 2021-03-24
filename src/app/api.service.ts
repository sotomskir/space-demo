import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { Launch } from './interfaces/launch';
import { LaunchParams } from './interfaces/launch-params';
import { Location } from './interfaces/location';
import { ApiResponse } from './interfaces/api-response';
import { get, set } from 'idb-keyval';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private defaultParams: LaunchParams = {
    format: 'json',
    limit: 50,
    ordering: 'net'
  };

  constructor(private http: HttpClient) {
  }

  getLaunchList(params: LaunchParams): Observable<ApiResponse<Launch[]>> {
    return from(get(JSON.stringify(params))).pipe(
      switchMap(cachedResponse => {
        if (cachedResponse) {
          return of(cachedResponse);
        }
        return this.http.get<ApiResponse<Launch[]>>('https://ll.thespacedevs.com/2.0.0/launch/upcoming/', {
          params: this.prepareParams(params)
        }).pipe(tap(response => set(JSON.stringify(params), response)));
      })
    ).pipe(
      catchError(e => {
        alert(e?.error?.detail);
        throw e;
      })
    );
  }

  getLocations(): Observable<Location[]> {
    return from(get('locations')).pipe(
      switchMap(cachedResponse => {
        if (cachedResponse) {
          return of(cachedResponse);
        }
        return this.http.get<ApiResponse<Location[]>>(`https://ll.thespacedevs.com/2.0.0/location/`, {
          params: {
            mode: 'json',
            limit: '1000',
          }
        }).pipe(
          map(response => response.results),
          map(locations => locations.sort((a, b) => a.name?.localeCompare(b.name))),
          tap(locations => set('locations', locations))
        );
      })
    ).pipe(
      catchError(e => {
        alert(e?.error?.detail);
        throw e;
      })
    );
  }

  private prepareParams(params: LaunchParams): HttpParams {
    const httpParams = Object.assign(this.defaultParams, params);
    Object.keys(httpParams).forEach(key => {
      if (httpParams[key] === undefined || httpParams[key] === null || httpParams[key] === '') {
        delete httpParams[key];
      }
    });
    delete httpParams.nextPage;
    return httpParams as unknown as HttpParams;
  }
}
