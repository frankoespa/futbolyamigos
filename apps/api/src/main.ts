import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap () {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = 'api';
    const configService = app.get(ConfigService);
    app.setGlobalPrefix(globalPrefix);
    await app.listen(configService.get<string>('PORT'));
    Logger.log(
        `🚀 Application is running on (${configService.get<string>('NODE_ENV')}) mode: http://localhost:${configService.get<string>('PORT')}/${globalPrefix}`
    );
}

bootstrap();
