import { Component } from '@angular/core';
import { SeatTableComponent } from "../seat-table/seat-table.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [SeatTableComponent]
})
export class AdminComponent {}
