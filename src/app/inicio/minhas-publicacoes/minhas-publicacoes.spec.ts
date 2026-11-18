import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MinhasPublicacoes } from './minhas-publicacoes';

describe('MinhasPublicacoes', () => {
  let component: MinhasPublicacoes;
  let fixture: ComponentFixture<MinhasPublicacoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MinhasPublicacoes],
      imports: [FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MinhasPublicacoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
