import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonDataService } from 'src/app/shared/common-data.service';
import { PlayerScore } from 'src/app/shared/model/player-score';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  op: { name: any, value: any }[]
  filters = [
    {
      name: 'Match Type', value: 'matchType',
      options: this.op,
      fc: new FormControl(), width: '90px'
    },
    {
      name: 'Teams For', value: 'teamId',
      options: this.op,
      fc: new FormControl(), width: '120px'
    },
    {
      name: 'Venues', value: 'venueId',
      options: this.op,
      fc: new FormControl(), width: '120px'
    },
    {
      name: 'Opponent', value: 'oppTeamId',
      options: this.op,
      fc: new FormControl(), width: '90px'
    }
  ]

  constructor(public dataService: CommonDataService) {
  }

  ngOnInit() {
    this.dataService.applyFilter.subscribe((letsgo) => {
      this.filters.forEach(f => {
        let filtered = this.extractUniqueValues(f.value)
        f.options = []
        let selectedOptions = []
        filtered.forEach(element => {
          let name = element
          if (this.dataService.mapping.has(f.value)) {
            name = this.dataService.mapping.get(f.value).get(element)
          }
          f.options.push({ name: name, value: element })
          selectedOptions.push(element)
        })
        f.fc.setValue(selectedOptions)
      });
    })
  }

  extractUniqueValues(key) {
    let values = new Set()
    this.dataService.playerScoreCard.forEach(inning => {
      values.add(inning[key])
    })

    return values;
  }

  getBaseNameForSelection(sel) {
    if (sel.fc.value) {
      let val = sel.fc.value[0]
      if (this.dataService.mapping.has(sel.value)) {
        val = this.dataService.mapping.get(sel.value).get(sel.fc.value[0])
      }
      return val
    }
    return '';
  }

  selectAll(sel) {
    sel.fc.patchValue([...sel.options.map(item => item.value)]);
  }

  deselectAll(sel) {
    sel.fc.patchValue([])
  }

  clearFilters() {
    this.filters.forEach(f => {
      this.selectAll(f)
    })
    this.applyFilters()
  }

  applyFilters() {
    this.dataService.filteredPlayerScoreCard = this.dataService.playerScoreCard
    this.filters.forEach(f => {
      if (f.fc.value.length > 0 && f.options.length != f.fc.value.length) {
        this.dataService.filteredPlayerScoreCard = this.filterBasedOnKey(f.value, f.fc.value)
      }
    })
    this.dataService.refreshChartsSubject.next(true)
  }

  filterBasedOnKey(key, filVal) {
    let localFilter = []
    
    filVal.forEach(fv => {
      localFilter.push.apply(localFilter, this.dataService.filteredPlayerScoreCard.filter(inning =>
        inning[key] == fv));
    });

    return localFilter
  }
}
