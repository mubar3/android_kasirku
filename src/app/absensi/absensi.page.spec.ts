import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbsensiPage } from './absensi.page';

describe('AbsensiPage', () => {
  let component: AbsensiPage;
  let fixture: ComponentFixture<AbsensiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AbsensiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
