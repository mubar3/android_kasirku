import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarangPage } from './barang.page';

describe('BarangPage', () => {
  let component: BarangPage;
  let fixture: ComponentFixture<BarangPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BarangPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
