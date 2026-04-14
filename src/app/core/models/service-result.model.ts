export interface ServiceResult<T>{

correct: boolean;
status: number;
message?: string;
errorMessage?: string;
object: T;
objects: T[];
}