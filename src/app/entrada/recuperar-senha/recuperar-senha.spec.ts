import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RecuperarSenha } from './recuperar-senha';

describe('RecuperarSenha', () => {
  let component: RecuperarSenha;
  let fixture: ComponentFixture<RecuperarSenha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecuperarSenha],
      imports: [FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarSenha);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
