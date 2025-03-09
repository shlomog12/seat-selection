import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { routes } from './app.routes';
import { CheckboxListComponent } from './checkbox-list/checkbox-list.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    AdminComponent,
    CheckboxListComponent
  ],
  providers: []
})
export class AppModule {}
