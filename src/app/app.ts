import { Component, inject, signal } from '@angular/core';
import { ModoVisitanteService } from './core/modo-visitante.service';

@Component({
  selector: 'app-root',
  standalone: false,
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly visitante = inject(ModoVisitanteService);
  protected readonly title = signal('achados-unifio');
}
