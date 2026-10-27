import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { EntradaRoutingModule } from './entrada-routing-module';
import { Cadastro } from './cadastro/cadastro';
import { Login } from './login/login';

@NgModule({
  declarations: [Cadastro, Login],
  imports: [
    CommonModule,
    FormsModule,
    EntradaRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
})
export class EntradaModule {}
