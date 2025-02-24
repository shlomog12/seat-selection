import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatTableComponent } from './seat-table.component';

describe('SeatTableComponent', () => {
  let component: SeatTableComponent;
  let fixture: ComponentFixture<SeatTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
