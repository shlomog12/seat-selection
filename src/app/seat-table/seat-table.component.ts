import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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
export class SeatTableComponent implements OnInit {

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
  @Output() onUsersChanged = new EventEmitter<SelectionModel[]>();
  @Input() filtersUsers !: SelectionModel[];

  column1: any[] = [];
  column2: any[] = [];
  column3: any[] = [];
  column4: any[] = [];
  firstRowLeft: any[] = [];
  firstRowRight: any[] = [];
  selections!: SelectionModel[];

  constructor(private dataService: DataService, private dialog: MatDialog) { 
    this.generateSeating();
    // this.dataService.init();
  }

  ngOnInit() {
      if (this.isAdmin) {
        this.toggleAdminMode();
      }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filtersUsers'] && changes['filtersUsers'].currentValue) {
      this.showSeatNames();
    }
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
    if (this.isAdmin){
      this.editSeatNumber(seat);
    }
  }

  hasAtLeastTwoWords(str:string) {
    return str.trim().split(/\s+/).length >= 2;
}

submitSelection() {
  this.foo();
}

  async submitSelection2() {
    if (this.isAdmin){
      this.submitSelectionAdmin();
      return;
    }

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
  submitSelectionAdmin() {
    const seatNames = this.getAllSeats().map((seat) => {
      return { number: seat.number, title: seat.title, selected: seat.selected };
    });
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
      seat.names = [];
    });
    console.log("admin mode");
    console.log(this.getAllSeats());
    this.selections = await this.getAllSelections();
    this.onUsersChanged.emit(this.selections);
    console.log(this.selections);
    
  }

  showSeatNames() {
    this.getAllSeats().forEach((seat) => {
      seat.names = [];
    });

    this.filtersUsers.forEach((selection: SelectionModel) => {
      selection.selected.forEach((seatNumber) => { 
        this.getAllSeats().forEach((seat) => {
          if (seat.number === seatNumber) {
            seat.names.push(selection.fullname);
          }
        });
      });
    });

    this.getAllSeats().forEach((seat) => {
        console.log(seat.number, seat.names);
    });
  }

  async getAllSelections(): Promise<any[]> { 
    return await this.dataService.getAllSelections();
  }


  editSeatNumber(seat: any) {
    if (this.isAdmin) {
      seat.editing = true;
      // seat.newTitle = seat.number; // שמור את המספר הנוכחי לעריכה
    }
  }


  saveSeatNumber(seat: any) {
    console.log("aa");
    if (this.isAdmin && seat.newTitle) {
      seat.title = seat.newTitle;
      seat.selected = true;
    }
    seat.editing = false; // סיום מצב העריכה
  }

  foo(){
    const sh = this.getShibuz();
    let counter = 0;
    this.getAllSeats().forEach((seat) => {
      if (this.isAdmin) {
        seat.title = sh.find((s) => s.number === seat.number)?.title;
      }
      seat.selected = sh.find((s) => s.number === seat.number)?.selected;
      if (seat.selected) {
        counter++;
      }
    });
    console.log("סהכ מקומות שנבחרו:", counter);
  }

  getShibuz(){
    return [
      {
          "number": 1,
          "title": "חסן",
          "selected": true
      },
      {
          "number": 2,
          "title": "נגר",
          "selected": true
      },
      {
          "number": 3,
          "title": "ברעד",
          "selected": true
      },
      {
          "number": 4,
          "title": "רטה",
          "selected": true
      },
      {
          "number": 5,
          "selected": false
      },
      {
          "number": 6,
          "title": "אזולאי נתן",
          "selected": true
      },
      {
          "number": 7,
          "title": "הלוי",
          "selected": true
      },
      {
          "number": 8,
          "title": "כהן משה",
          "selected": true
      },
      {
          "number": 9,
          "title": "ברטפלד",
          "selected": true
      },
      {
          "number": 10,
          "selected": false
      },
      {
          "number": 11,
          "title": "יהושע",
          "selected": true
      },
      {
          "number": 12,
          "title": "אהרוני נעם",
          "selected": true
      },
      {
          "number": 13,
          "selected": false
      },
      {
          "number": 14,
          "title": "ברזילי",
          "selected": true
      },
      {
          "number": 15,
          "selected": false
      },
      {
          "number": 16,
          "title": "סימן טוב",
          "selected": true
      },
      {
          "number": 17,
          "selected": false
      },
      {
          "number": 18,
          "selected": false
      },
      {
          "number": 19,
          "title": "לרנר",
          "selected": true
      },
      {
          "number": 20,
          "title": "לרנר",
          "selected": true
      },
      {
          "number": 21,
          "title": "אזולאי שמואל",
          "selected": true
      },
      {
          "number": 22,
          "selected": false
      },
      {
          "number": 23,
          "selected": false
      },
      {
          "number": 24,
          "title": "חיים",
          "selected": true
      },
      {
          "number": 25,
          "title": "סנדרס",
          "selected": true
      },
      {
          "number": 26,
          "selected": false
      },
      {
          "number": 27,
          "title": "דניאלי",
          "selected": true
      },
      {
          "number": 28,
          "title": "יגל",
          "selected": true
      },
      {
          "number": 29,
          "title": "זר",
          "selected": true
      },
      {
          "number": 30,
          "selected": false
      },
      {
          "number": 31,
          "title": "גליק",
          "selected": true
      },
      {
        "number": 32,
        "title": "אהרוני אמיתי",
        "selected": true
      },
      {
          "number": 33,
          "title": "מרגלית",
          "selected": true
      },
      {
          "number": 34,
          "title": "מרגלית",
          "selected": true
      },
      {
          "number": 35,
          "title": "מרגלית",
          "selected": true
      },
      {
          "number": 36,
          "title": "רבינוביץ",
          "selected": true
      },
      {
          "number": 37,
          "title": "קאפח מתניה",
          "selected": true
      },
      {
          "number": 38,
          "selected": false
      },
      {
          "number": 39,
          "title": "בוסי",
          "selected": true
      },
      {
          "number": 40,
          "title": "נפש",
          "selected": true
      },
      {
          "number": 41,
          "title": "שטראוס",
          "selected": true
      },
      {
          "number": 42,
          "selected": false
      },
      {
          "number": 43,
          "selected": false
      },
      {
          "number": 44,
          "title": "שוועל",
          "selected": true
      },
      {
          "number": 45,
          "title": "שטרן",
          "selected": true
      },
      {
          "number": 46,
          "selected": false
      },
      {
          "number": 47,
          "selected": false
      },
      {
          "number": 48,
          "title": "עמרם",
          "selected": true
      },
      {
          "number": 49,
          "title": "אהרוני יהונתן",
          "selected": true
      },
      {
          "number": 50,
          "selected": false
      },
      {
          "number": 51,
          "selected": false
      },
      {
          "number": 52,
          "title": "אפרתי",
          "selected": true
      },
      {
          "number": 53,
          "title": "כהן חיים",
          "selected": true
      },
      {
          "number": 54,
          "title": "בלטמן",
          "selected": true
      },
      {
          "number": 55,
          "title": "בוגנים",
          "selected": true
      },
      {
          "number": 56,
          "title": "אזולאי חננאל",
          "selected": true
      },
      {
          "number": 57,
          "title": "אונגר",
          "selected": true
      },
      {
          "number": 58,
          "title": "לזר",
          "selected": true
      },
      {
          "number": 59,
          "title": "שטריך",
          "selected": true
      },
      {
          "number": 60,
          "title": "סימקוביץ",
          "selected": true
      },
      {
          "number": 61,
          "title": "מרדכי",
          "selected": true
      },
      {
          "number": 62,
          "title": "דהן",
          "selected": true
      },
      {
          "number": 63,
          "selected": false
      },
      {
          "number": 64,
          "title": "לסינגר",
          "selected": true
      },
      {
          "number": 65,
          "title": "קאפח אלעד",
          "selected": true
      },
      {
          "number": 66,
          "selected": false
      },
      {
        "number": 67,
        "selected": false
      },
      {
          "number": 68,
          "title": "כהן יאר",
          "selected": true
      },
      {
          "number": 69,
          "title": "פרל",
          "selected": true
      },
      {
          "number": 70,
          "title": "בן אלי",
          "selected": true
      },
      {
          "number": 71,
          "title": "בן אלי",
          "selected": true
      },
      {
          "number": 72,
          "title": "בן אלי",
          "selected": true
      },
      {
          "number": 73,
          "title": "סלמה",
          "selected": true
      },
      {
          "number": 74,
          "selected": false
      },
      {
          "number": 75,
          "selected": false
      },
      {
          "number": 76,
          "title": "בן יאיר",
          "selected": true
      },
      {
          "number": 77,
          "title": "זית",
          "selected": true
      },
      {
          "number": 78,
          "selected": false
      },
      {
          "number": 79,
          "selected": false
      },
      {
          "number": 80,
          "title": "גדליוביץ",
          "selected": true
      },
      {
          "number": 81,
          "title": "ריבלין",
          "selected": true
      },
      {
          "number": 82,
          "title": "חדד",
          "selected": true
      },
      {
          "number": 83,
          "selected": false
      },
      {
          "number": 84,
          "title": "פאטשינו",
          "selected": true
      },
      {
          "number": 85,
          "title": "כהן עמוס",
          "selected": true
      },
      {
          "number": 86,
          "title": "כהן עמוס",
          "selected": true
      },
      {
          "number": 87,
          "title": "כהן עמוס",
          "selected": true
      },
      {
          "number": 88,
          "selected": false
      },
      {
          "number": 89,
          "title": "רקנטי",
          "selected": true
      },
      {
          "number": 90,
          "selected": false
      },
      {
          "number": 91,
          "selected": false
      },
      {
          "number": 92,
          "selected": false
      },
      {
          "number": 93,
          "title": "לנגרמן",
          "selected": true
      },
      {
          "number": 94,
          "selected": false
      },
      {
          "number": 95,
          "selected": false
      },
      {
          "number": 96,
          "title": "לביא",
          "selected": true
      }
  ];
  }

}