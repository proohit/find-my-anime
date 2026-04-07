import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppToolbar } from './app-toolbar';

describe('AppToolbar', () => {
  let component: AppToolbar;
  let fixture: ComponentFixture<AppToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppToolbar],
    }).compileComponents();

    fixture = TestBed.createComponent(AppToolbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
