import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pesquisa } from './pesquisa';

describe('Pesquisa', () => {
  let component: Pesquisa;
  let fixture: ComponentFixture<Pesquisa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Pesquisa],
    }).compileComponents();

    fixture = TestBed.createComponent(Pesquisa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
