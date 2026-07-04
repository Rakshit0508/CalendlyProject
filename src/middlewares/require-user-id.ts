import { Request,Response,NextFunction } from "express";
import { badRequest, notFound, unauthorized } from "../utils/api-error.js";
import { getUserById } from "../repositories/user.repository.js";


export async function requireUserId( req:Request,_res:Response,next:NextFunction){
    const userIdHeader= req.header('x-user-id');

    if(!userIdHeader || Array.isArray(userIdHeader)|| typeof userIdHeader!=='string'){
        throw unauthorized('x-user-id header is required');
    }

    const userId= Number(userIdHeader);
    if(Number.isNaN(userId)){
        throw badRequest('x-user-id header must be a valid number');
    }
    const host= await getUserById(userId);
    if(!host){
        throw notFound('User does not exist in the database');
    }
    req.userId= userId;
    next();
}