export interface ServiceResult<T>{

correct: boolean;
status: number;
message?: string;
ErrorMessage?: string;
object: T;
Objects: T[];
}