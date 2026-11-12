import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Cadastro } from './cadastro/cadastro';
import { Login } from './login/login';
import { RecuperarSenha } from './recuperar-senha/recuperar-senha';
import { ConfirmarCodigo } from './confirmar-codigo/confirmar-codigo';
import { NovaSenha } from './nova-senha/nova-senha';

const routes: Routes = [
  {
    path: 'cadastro', component: Cadastro
  },
  {
    path: 'login', component: Login
  },
  {
    path:'recuperar-senha', component:RecuperarSenha 
  },

  {
    path:'confirmar-codigo' , component:ConfirmarCodigo
  },

  {
    path:'nova-senha' , component:NovaSenha
  }

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntradaRoutingModule {}
