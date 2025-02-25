import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeatTableComponent } from './seat-table/seat-table.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SeatTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'seat-selection';
}
