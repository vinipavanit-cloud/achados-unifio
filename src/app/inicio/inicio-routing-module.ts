import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Inicio } from './inicio';
import { Pesquisa } from './pesquisa/pesquisa';
import { Publicar } from './publicar/publicar';
import { Detalhe } from './detalhe/detalhe';
import { MinhasPublicacoes } from './minhas-publicacoes/minhas-publicacoes';
import { Dashboard } from './dashboard/dashboard';
import { adminGuard } from '../core/admin.guard';

const routes: Routes = [
  {
    path: '', component: Inicio
  },

  {
    path: 'pesquisar', component: Pesquisa
  },

  {
    path: 'publicar', component: Publicar
  },

  {
    path: 'detalhe/:id', component: Detalhe
  },

  {
    path: 'minhas-publicacoes', component: MinhasPublicacoes
  },

  {
    path: 'dashboard', component: Dashboard, canActivate: [adminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioRoutingModule {}
