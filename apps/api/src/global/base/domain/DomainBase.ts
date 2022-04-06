import { Document } from 'mongoose';

export abstract class DomainBase<T extends Document> {
    constructor (protected doc: T) {}

    async Save (): Promise<T> {
        return await this.doc.save();
    }

    async Delete (): Promise<T> {
        return await this.doc.delete();
    }

    get Doc (): Readonly<T> {
        return this.doc
    }
}