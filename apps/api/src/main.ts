import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/AppModule';
import { InitialDataService } from './db/providers/InitialDataService';
import { HttpExceptionFilter } from './global/base/exceptions/filter/HttpExceptionFilter';
import { ValidationException } from './global/base/exceptions/ValidationException';
import { UserLogic } from './user/providers/UserLogic';
import * as cookieParser from 'cookie-parser';

async function bootstrap () {
    const app = await NestFactory.create(AppModule);

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    app.enableCors({ origin: '*' });
    app.use(cookieParser());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            exceptionFactory: (validations) => {
                return new ValidationException(validations[0].constraints[Object.keys(validations[0].constraints)[0]]);
            }
        })
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    const configService = app.get(ConfigService);
    const initialDbData = app.get(InitialDataService);
    const userLogic = app.get(UserLogic);

    await initialDbData.Initialize();
    await userLogic.CreateFirstAdmin();

    await app.listen(configService.get<string>('PORT'));

    Logger.log(
        `🚀 Application is running on (${configService.get<string>('NODE_ENV')}) mode: http://localhost:${configService.get<string>('PORT')}/${globalPrefix}`
    );
}

bootstrap();
