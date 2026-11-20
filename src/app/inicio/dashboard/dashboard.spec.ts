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

  it('calcula os indicadores a partir das publicações', async () => {
    http.expectOne((r) => r.url === `${API_URL}/publicacao/listarTodos`).flush({
      content: [
        { idPublicacao: 1, status: 'ATIVA', tipo: 'PERDIDO', usuario: null },
        { idPublicacao: 2, status: 'FINALIZADA', tipo: 'ENCONTRADO', usuario: null },
      ],
    });
    await fixture.whenStable();
    expect(component.kpis().total).toBe(2);
    expect(component.kpis().perdidos).toBe(1);
    expect(component.kpis().finalizadas).toBe(1);
  });
});