import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Login],
      imports: [FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const testeConexao = () =>
    TestBed.inject(HttpTestingController).expectOne((r) => r.url.endsWith('/usuario/autenticacao/csrf'));

  it('should create', async () => {
    testeConexao().flush({ token: 'abc' });
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('não oferece o modo visitante quando o servidor responde', async () => {
    testeConexao().flush({ token: 'abc' });
    await fixture.whenStable();
    expect(component.servidorOffline()).toBe(false);
  });

  it('oferece o modo visitante quando o servidor está fora do ar', async () => {
    testeConexao().flush('down', { status: 502, statusText: 'Bad Gateway' });
    await fixture.whenStable();
    expect(component.servidorOffline()).toBe(true);
  });
});
