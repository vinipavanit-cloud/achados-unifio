import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

import { InicioRoutingModule } from './inicio-routing-module';
import { Detalhe } from './detalhe/detalhe';
import { Inicio } from './inicio';
import { Pesquisa } from './pesquisa/pesquisa';
import { Publicar } from './publicar/publicar';
import { MinhasPublicacoes } from './minhas-publicacoes/minhas-publicacoes';
import { Dashboard } from './dashboard/dashboard';
import { Contatos } from './contatos/contatos';

@NgModule({
  declarations: [Inicio, Detalhe, Pesquisa, Publicar, MinhasPublicacoes, Dashboard, Contatos],
  imports: [
    CommonModule,
    InicioRoutingModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
})
export class InicioModule {}
