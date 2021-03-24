import { Injectable } from '@angular/core';
import { LaunchParams } from './interfaces/launch-params';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private filters = new BehaviorSubject({
    limit: 50,
    offset: 0
  });

  getFilters(): Observable<LaunchParams> {
    return this.filters.asObservable();
  }

  getCurrentFilters(): LaunchParams {
    return this.filters.getValue();
  }

  nextPage(): void {
    this.update({offset: this.filters.getValue().offset + this.filters.getValue().limit, nextPage: true});
  }

  update(param: LaunchParams): void {
    this.filters.next(Object.assign(this.filters.getValue(), {offset: 0, nextPage: false}, param));
  }
}
