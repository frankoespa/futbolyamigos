import { Document } from 'mongoose';

export abstract class DomainBase<T extends Document> {
    constructor (protected doc: T) {}

    async Save (): Promise<T> {
        return await this.doc.save();
    }

    get Doc (): Readonly<T> {
        return this.doc
    }
}