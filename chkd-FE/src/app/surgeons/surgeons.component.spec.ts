import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurgeonsComponent } from './surgeons.component';

describe('SurgeonsComponent', () => {
  let component: SurgeonsComponent;
  let fixture: ComponentFixture<SurgeonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurgeonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurgeonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
