import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ConfirmarCodigo } from './confirmar-codigo';

describe('ConfirmarCodigo', () => {
  let component: ConfirmarCodigo;
  let fixture: ComponentFixture<ConfirmarCodigo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmarCodigo],
      imports: [FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmarCodigo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
