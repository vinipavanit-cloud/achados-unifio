import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, provideRouter } from '@angular/router';
import { API_URL } from '../../core/api.config';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Dashboard],
      imports: [MatIconModule, MatButtonModule, RouterModule],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('carrega os indicadores do endpoint do dashboard', async () => {
    const indicadores = {
      usuariosCadastrados: 8,
      publicacoesAtivas: 4,
      publicacoesFinalizadas: 2,
      perdidos: 3,
      encontrados: 3,
    };
    http.expectOne((r) => r.url === `${API_URL}/dashboard`).flush(indicadores);
    await fixture.whenStable();
    expect(component.dados()).toEqual(indicadores);
  });
});