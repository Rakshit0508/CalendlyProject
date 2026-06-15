import {Request, Response} from 'express';
import { findAllUsers as findAllUsersService, findUserById as findUserByIdService} from '../services/users.service.js';

export async function findAllusers(_req:Request, res:Response){
    const response= await findAllUsersService();
    res.json(response);

}

export async function findUserId(req:Request, res:Response){
    const {id}= req.params;
    const response= await findUserByIdService(Number(id));
    res.json(response);
}