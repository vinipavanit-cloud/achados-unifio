import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntradaRoutingModule } from './entrada-routing-module';
import { Cadastro } from './cadastro/cadastro';
import { Login } from './login/login';

@NgModule({
  declarations: [Cadastro, Login],
  imports: [CommonModule, EntradaRoutingModule],
})
export class EntradaModule {}
