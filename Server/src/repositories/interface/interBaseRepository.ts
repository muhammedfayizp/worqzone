import { Document,UpdateQuery,QueryOptions,FilterQuery,PipelineStage } from "mongoose";

export interface InterBaseRepository <T extends Document>{
    create(item:T):Promise<T>;
    findById(id:string):Promise<T|null>;
    updateById(id:string,data:UpdateQuery<T>,options?:QueryOptions):Promise<T|null>;
    // find(filter:FilterQuery<T>,projection?:Record<string,number>):Promise<T[]>
    
}