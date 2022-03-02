import { Document, Model, Types } from 'mongoose';
import { DomainBase } from '../domain/DomainBase';

export abstract class RepositoryBase<T extends Document, D extends DomainBase<T>> {
    constructor (protected readonly model: Model<T>, private readonly typeDomain: new (document: T) => D) {}

    protected async FindWithId (id: number | Types.ObjectId): Promise<D> {
        const doc = await this.model.findById(id).exec();
        return doc ? new this.typeDomain(doc) : null;
    }

    protected async ReadAll (): Promise<D[]> {
        const allDocs = await this.model.find({}).exec();

        return allDocs.map(doc => new this.typeDomain(doc));
    }
}