import { Global, Module } from '@nestjs/common';
import { DocumentLoaderDomainService } from './providers/DocumentLoaderDomainService';

@Global()
@Module({
    providers: [DocumentLoaderDomainService],
    exports: [DocumentLoaderDomainService]
})
export class SharedModule {}