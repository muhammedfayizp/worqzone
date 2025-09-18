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
    async findById(id:string):Promise<T|null>{
        try {
            return await this.model.findById(id).exec()
        } catch (error) {
            throw new Error(error instanceof Error?error.message:String(error))
        }
    }
    async updateById(id: string, data: UpdateQuery<T>, options?: QueryOptions): Promise<T | null> {
        try {
            return await this.model.findByIdAndUpdate(id,data,{...options,new:true})
        } catch (error) {
            throw new Error(error instanceof Error?error.message:String(error))
        }
    }
}