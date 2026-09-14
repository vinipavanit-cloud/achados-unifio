import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Cadastro } from './cadastro/cadastro';
import { Login } from './login/login';

const routes: Routes = [
  {
    path: 'cadastro', component: Cadastro
  },
  {
    path: 'login', component: Login
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntradaRoutingModule {}
