import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SelectionModel } from './selection.model';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashAlt, faArrowLeft, faColumns, faWalking, faWindowMaximize, faArrowRight, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { DataService } from './data.service';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
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
  selectedSeats!: number[]
  @Input() isAdmin: boolean = false;


  column1: any[] = [];
  column2: any[] = [];
  column3: any[] = [];
  column4: any[] = [];
  firstRowLeft: any[] = [];
  firstRowRight: any[] = [];

  constructor(private dataService: DataService, private dialog: MatDialog) { 
    this.generateSeating();
    this.dataService.init();
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

  hasAtLeastTwoWords(str:string) {
    return str.trim().split(/\s+/).length >= 2;
}

  async submitSelection() {

    this.selectedSeats = [
      ...this.column1.flat(),
      ...this.column2.flat(),
      ...this.column3.flat(),
      ...this.column4.flat(),
      ...this.firstRowLeft,
      ...this.firstRowRight
    ]
      .filter(seat => seat.selected)
      .map(seat => seat.number);
    
    if (!this.selectedSeats || this.selectedSeats.length < 3){
      alert("יש לבחור לפחות 3 מקומות");
      return;
    }
    if (!this.fullName || this.fullName.length < 4 || !this.hasAtLeastTwoWords(this.fullName)){
      alert("חובה להגיש את הטופס עם שם מלא");
      return;
    }
    console.log("שם מלא", this.fullName ,"כיסאות שנבחרו:", this.selectedSeats, "הערה:", this.noteInput);
    this.openDialog();
    // window.close();
  }

  async sendData() {
    const newSelection: SelectionModel = {
      fullname: this.fullName,
      comment: this.noteInput,
      selected: this.selectedSeats  // Selected seat IDs
    };
    try {
      await this.dataService.insertData(newSelection);
    } catch (error) {
      console.log(error);
      alert("חלה שגיאה אנא פנה לועד בית הכנסת");
    } 
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

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '50vw', // יחידות רספונסיביות
      data: {
        title: '📋 פרטי הבחירה',
        message: `
      <strong>🔹 שם מלא:</strong> ${this.fullName} <br><br>
      <strong>🎟️ כיסאות שנבחרו:</strong> ${this.selectedSeats.join(", ")} <br><br>
      <strong>📝 הערה:</strong> ${this.noteInput} <br><br>
      ✅ תודה רבה ובהצלחה!
        `
      }
    });
  
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        console.log('✅ אישור נלחץ');
        await this.sendData();
        console.log("data sended");
        window.close();
      } else {
        console.log('❌ ביטול נלחץ');
      }
    });
  }
  
  async toggleAdminMode() {

    this.getAllSeats().forEach((seat) => {
      seat.message = '';
    });
    const selections = await this.getAllSelections();
    console.log(selections);
    selections.forEach((selection: SelectionModel) => {
      console.log(selection.fullname);
      if (selection.fullname === 'שלמה גליק' || selection.fullname === 'יצחק לזר') {

        return

      }
      selection.selected.forEach((seatNumber) => { 
        

        this.getAllSeats().forEach((seat) => {
          if (seat.number === seatNumber) {
            console.log(seat.number);
            seat.message = `${seat.message} ${selection.fullname}`;
          }
        });
      });
    });

    this.getAllSeats().forEach((seat) => {
        console.log(seat.number, seat.message);
      
    });
    
  }

  async getAllSelections(): Promise<any[]> { 
    return await this.dataService.getAllSelections();
  }


  getSeatElementById(id: string) {

  }




}