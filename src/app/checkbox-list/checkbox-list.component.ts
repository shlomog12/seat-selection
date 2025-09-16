import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectionModel } from '../seat-table/selection.model';

@Component({
  selector: 'app-checkbox-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss']
})
export class CheckboxListComponent {
  isShowComments: boolean = false;
  showComments(){
    this.isShowComments = !this.isShowComments;
  }
  clearAll() {
    this.selectedItemsMap = {};
    this.onSelectionChange();
}
  @Input() items: SelectionModel[] = [];
  @Output() selectionChanged = new EventEmitter<SelectionModel[]>();
  selectedItemsMap: { [key: string]: boolean } = {};

  

  ngOnInit() {
    this.selectAll();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items'] && changes['items'].currentValue) {
      this.selectAll();
    }
  }

  onSelectionChange() {
    const selectedItems = this.items.filter(item => this.selectedItemsMap[item.fullname]);
    this.selectionChanged.emit(selectedItems);
  }

  public selectAll(){
    this.items.forEach(item => this.selectedItemsMap[item.fullname] = true);
    this.onSelectionChange();
  }
}
