import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FiltersService } from '../filters.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../api.service';
import { Location } from '../interfaces/location';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Output() onsubmit = new EventEmitter<void>();

  @Input('locations') set setLocations(value: Location[]) {
    this.allLocations = value;
    this.locations.clear();
    const selectedLocations = this.filtersService.getCurrentFilters().location__ids;
    this.allLocations.forEach(location => {
      this.locations.push(this.fb.group({
        location: [location],
        checked: [selectedLocations?.includes(location.id)],
      }));
    });
    this.filteredLocations = this.locations.controls;
  }

  form: FormGroup;
  subscription = new Subscription();
  allLocations: Location[] = [];
  filteredLocations: AbstractControl[];

  constructor(private fb: FormBuilder, private filtersService: FiltersService, private api: ApiService) {
    this.form = fb.group({
      locations: fb.array([]),
      search: [],
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.form.controls.search.valueChanges.pipe(
        debounceTime(300),
      ).subscribe(value => this.search(value))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get locations(): FormArray {
    return this.form.controls.locations as FormArray;
  }

  submit(): void {
    this.filtersService.update({
      location__ids: this.form.value.locations.filter(item => item.checked).map(item => item.location.id)?.join(',')
    });
    this.onsubmit.emit();
  }

  reset(): void {
    this.locations.controls.forEach(control => control.patchValue({checked: false}));
    this.submit();
  }

  search(searchTerm): void {
    this.filteredLocations = this.locations.controls.filter(control =>
      control.value.location?.name?.toLowerCase()?.indexOf(searchTerm?.toLowerCase()) !== -1);
  }
}
