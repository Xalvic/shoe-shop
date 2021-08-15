import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoeViewComponent } from './shoe-view.component';

describe('ShoeViewComponent', () => {
  let component: ShoeViewComponent;
  let fixture: ComponentFixture<ShoeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
