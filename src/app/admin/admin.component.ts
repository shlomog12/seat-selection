import { Component, Input } from '@angular/core';
import { SeatTableComponent } from "../seat-table/seat-table.component";
import { CheckboxListComponent } from '../checkbox-list/checkbox-list.component';
import { SelectionModel } from '../seat-table/selection.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [SeatTableComponent, CheckboxListComponent]
})
export class AdminComponent {
  filtersUsers !: SelectionModel[];

  
updateUsers(newUserNames: SelectionModel[]) {
  this.userNames = newUserNames;
}
  userNames!: SelectionModel[];

  
  onSelectionChanged(selectedItems: SelectionModel[]) {
    this.filtersUsers = selectedItems;
    // console.log('Selected items:', selectedItems);
  }
}
