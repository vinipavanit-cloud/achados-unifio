import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { EntradaRoutingModule } from './entrada-routing-module';
import { Cadastro } from './cadastro/cadastro';
import { Login } from './login/login';
import { RecuperarSenha } from './recuperar-senha/recuperar-senha';
import { ConfirmarCodigo } from './confirmar-codigo/confirmar-codigo';
import { NovaSenha } from './nova-senha/nova-senha';

@NgModule({
  declarations: [Cadastro, Login, RecuperarSenha, ConfirmarCodigo, NovaSenha],
  imports: [
    CommonModule,
    FormsModule,
    EntradaRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
})
export class EntradaModule {}
