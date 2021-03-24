import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { Launch } from './interfaces/launch';
import { Subscription } from 'rxjs';
import { FiltersService } from './filters.service';
import { LaunchParams } from './interfaces/launch-params';
import { Location } from './interfaces/location';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  launchList: Launch[];
  count: number;
  isOpen = false;
  locations: Location[];
  private subscription = new Subscription();

  constructor(private api: ApiService, private filtersService: FiltersService) {
  }

  ngOnInit(): void {
    this.subscription.add(
      this.filtersService.getFilters().subscribe((filters) => {
        this.fetchLaunchList(filters);
      })
    );
    this.api.getLocations().subscribe(locations => {
      this.locations = locations;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private fetchLaunchList(filters: LaunchParams): void {
    this.api.getLaunchList(filters).subscribe(response => {
      this.count = response.count;
      if (filters.nextPage) {
        this.launchList.push(...response.results);
      } else {
        this.launchList = response.results;
      }
    });
  }

  onScroll(): void {
    this.filtersService.nextPage();
  }
}
