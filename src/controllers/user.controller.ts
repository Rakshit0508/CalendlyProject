import {Request, Response} from 'express';
import { findAllUsers as findAllUsersService } from '../services/users.service.js';

export async function findAllusers(_req:Request, res:Response){
    const response= await findAllUsersService();
    res.json(response);

}