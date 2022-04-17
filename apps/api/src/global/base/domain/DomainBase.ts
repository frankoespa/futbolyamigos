import { Document, QueryOptions, SaveOptions } from 'mongoose';

export abstract class DomainBase<T extends Document> {
    constructor (protected doc: T) {}

    async Save (options?: SaveOptions): Promise<T> {
        return await this.doc.save(options);
    }

    async Delete (options?: QueryOptions): Promise<T> {
        return await this.doc.delete(options);
    }

    get Doc (): Readonly<T> {
        return this.doc
    }
}