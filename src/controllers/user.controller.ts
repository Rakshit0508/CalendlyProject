import {Request, Response} from 'express';
import { createUserByNameAndEmail as createUserByNameAndEmailService, deleteUserByEmail as deleteUserByEmailService,
findAllUsers as findAllUsersService, findUserById as findUserByIdService,
updateUserByEmail as updateUserByEmailService} from '../services/users.service.js';
import { sendSuccess } from '../utils/api-response.js';



export async function findAllusers(_req:Request, res:Response){
    const response= await findAllUsersService();
    sendSuccess(res,response);

}

export async function findUserById(req:Request, res:Response){
    const {userId}= req.params;
    const response= await findUserByIdService(Number(userId));
    sendSuccess(res,response);
}

export async function createSingleUser(req:Request, res:Response){
    const response= await createUserByNameAndEmailService(req.body);
    sendSuccess(res,response,201,'User created successfully');
}

export async function deleteSingleUser(req:Request,res:Response){
    const {userId}= req.params;
    const response= await deleteUserByEmailService(Number(userId));
    sendSuccess(res,response,200,'User deleted successfully');
}

export async function updateSingleUser(req:Request,res:Response){
    const {userId}= req.params;
    const response= await updateUserByEmailService(Number(userId),req.body);
    sendSuccess(res,response,201,'User updated successfully');
}