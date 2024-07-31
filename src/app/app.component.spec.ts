import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

import { selectUserFeature } from '@state/selectors';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: jest.Mocked<Store>;

  beforeEach(async () => {
    const storeMock = {
      select: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: Store, useValue: storeMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store)as jest.Mocked<Store>;
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should set user on ngOnInit', () => {
    const mockUser = { id: 'agent_xxx', label: 'agent de test' }; 
    // Given
    store.select.mockReturnValue(of(mockUser));

    // When
    component.ngOnInit();

    // Then
    expect(component.user).toEqual(mockUser);
    expect(store.select).toHaveBeenCalledWith(selectUserFeature);
  });
});
