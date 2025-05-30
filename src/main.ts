/* eslint-disable prettier/prettier */
/*Archivo src/main.ts */

import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
 const app = await NestFactory.create(AppModule);
 app.enableVersioning({
   type: VersioningType.URI,
   prefix: 'api/v',
   defaultVersion: '1',
 });
 await app.listen(3000);
}
bootstrap();
// Este archivo es el punto de entrada de la aplicación NestJS.