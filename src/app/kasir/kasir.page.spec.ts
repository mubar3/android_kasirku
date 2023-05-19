import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KasirPage } from './kasir.page';

describe('KasirPage', () => {
  let component: KasirPage;
  let fixture: ComponentFixture<KasirPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(KasirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
