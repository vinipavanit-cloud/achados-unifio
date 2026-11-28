import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_URL } from './api.config';
import { MockBackendService } from './mock-backend.service';
import { ModoVisitanteService } from './modo-visitante.service';

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_URL) || !inject(ModoVisitanteService).ativo()) {
    return next(req);
  }
  return inject(MockBackendService).tratar(req);
};
