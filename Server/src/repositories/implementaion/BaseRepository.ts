import { InterBaseRepository } from "../interface/interBaseRepository";
import { Model,Document,UpdateQuery } from "mongoose";
import { FilterQuery,PipelineStage,QueryOptions } from "mongoose";


export class BaseRepositories <T extends Document > implements InterBaseRepository<T>{
    protected readonly model:Model<T>;
    constructor(model:Model<T>){
        this.model=model
    }
    async create(item: T): Promise<T> {
        try {
            const newItem=new this.model(item)
            return await newItem.save()
        } catch (error) {
            throw new Error(error instanceof Error?error.message:String(error))
        }
    }
}