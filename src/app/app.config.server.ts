import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes, RenderMode } from '@angular/ssr';
import { appConfig } from './app.config';

const config: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes([{ path: '**', renderMode: RenderMode.Prerender }]))]
};
export const serverConfig = mergeApplicationConfig(appConfig, config);
