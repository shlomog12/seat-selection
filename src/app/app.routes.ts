import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { SeatTableComponent } from './seat-table/seat-table.component';

export const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: '**', component: SeatTableComponent }
];
