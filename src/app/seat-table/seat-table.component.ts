import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashAlt, faArrowLeft, faColumns, faWalking, faWindowMaximize, faArrowRight, faCheckDouble } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-seat-table',
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './seat-table.component.html',
  styleUrl: './seat-table.component.scss'
})
export class SeatTableComponent {
  fullName: string = '';
  noteInput: string = '';
  faTrashAlt = faTrashAlt;
  faArrowLeft = faArrowLeft;
  faColumns = faColumns;
  faWalking = faWalking;
  faWindowMaximize = faWindowMaximize;
  faArrowRight = faArrowRight;
  faCheckDouble = faCheckDouble;



  column1: any[] = [];
  column2: any[] = [];
  column3: any[] = [];
  column4: any[] = [];
  firstRowLeft: any[] = [];
  firstRowRight: any[] = [];

  constructor() {
    this.generateSeating();
  }

  generateSeating() {
    let seatNumber = 1;

    const columnStructure = [8, 4, 5, 7];

    [this.column1, this.column2, this.column3, this.column4].forEach((col, index) => {
      for (let i = 0; i < columnStructure[index]; i++) {
        let table: any[] = [];
        for (let j = 0; j < 4; j++) {
          table.push({ number: seatNumber++, selected: false });
        }
        col.push(table);
      }
    });
  }

  toggleSeat(seat: any) {
    seat.selected = !seat.selected;
  }

  submitSelection() {
    const selectedSeats = [
      ...this.column1.flat(),
      ...this.column2.flat(),
      ...this.column3.flat(),
      ...this.column4.flat(),
      ...this.firstRowLeft,
      ...this.firstRowRight
    ]
      .filter(seat => seat.selected)
      .map(seat => seat.number);
    
    if (!selectedSeats || selectedSeats.length < 3){
      alert("יש לבחור לפחות 3 מקומות");
      return;
    }
    if (!this.fullName || this.fullName.length < 4){
      alert("חובה להגיש את הטופס עם שם מלא");
      return;
    }
      console.log("שם מלא", this.fullName ,"כיסאות שנבחרו:", selectedSeats, "הערה:", this.noteInput);
    alert(
      "==== שם מלא ====\n" + this.fullName +
      "\n\n==== כיסאות שנבחרו ====\n" + selectedSeats.join(", ") +
      "\n\n==== הערה ====\n" + this.noteInput
    );
    
  }

  selectGroup(group: number[]) {
    this.getAllSeats().forEach((seat) => {
      if (group.includes(seat.number)) {
        seat.selected = true;
      }
    });
  }

  crateArrayByRange(start: number, end: number, step: number = 1) {
    return Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, i) => start + i * step);
  }

  selectAll() {
    const rangeArray = this.crateArrayByRange(1, 96);
    this.selectGroup(rangeArray);
  }

  selectLeftColumn() {
    const rangeArray = this.crateArrayByRange(1, 32);
    this.selectGroup(rangeArray);
  }

  selectLeftRightColumn() {
    const rangeArray = this.crateArrayByRange(33, 48);
    this.selectGroup(rangeArray);
  }

  selectRightLeftColumn() {
    const rangeArray = this.crateArrayByRange(49, 68);
    this.selectGroup(rangeArray);
  }

  selectRightColumn() {
    const rangeArray = this.crateArrayByRange(69, 96);
    this.selectGroup(rangeArray);
  }

  selectWindows() {
    const rangeLeft = this.crateArrayByRange(1, 32, 4);
    this.selectGroup(rangeLeft);
    const rangeRight = this.crateArrayByRange(72, 96, 4);
    this.selectGroup(rangeRight);
  }

  selectSpace() {
    const range1 = this.crateArrayByRange(4, 32, 4);
    this.selectGroup(range1);
    const range2 = this.crateArrayByRange(33, 45, 4);
    this.selectGroup(range2);
    const range3 = this.crateArrayByRange(36, 48, 4);
    this.selectGroup(range3);
    const range4 = this.crateArrayByRange(49, 65, 4);
    this.selectGroup(range4);
    const range5 = this.crateArrayByRange(52, 68, 4);
    this.selectGroup(range5);
    const range6 = this.crateArrayByRange(69, 93, 4);
    this.selectGroup(range6);
  }

  clearAll() {
    this.getAllSeats().forEach((seat) => {
      seat.selected = false;
    });
    this.noteInput = '';
    this.fullName = '';
  }

  getAllSeats() {
    return [this.column1.flat(), this.column2.flat(), this.column3.flat(), this.column4.flat()].flat();
  }
}