import {Request, Response} from 'express';
import { createUserByNameAndEmail as createUserByNameAndEmailService, deleteUserByEmail as deleteUserByEmailService, findAllUsers as findAllUsersService, findUserById as findUserByIdService, updateUserByEmail as updateUserByEmailService} from '../services/users.service.js';
import { sendSuccess } from '../utils/api-response.js';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto.js';


export async function findAllusers(_req:Request, res:Response){
    const response= await findAllUsersService();
    sendSuccess(res,response);

}

export async function findUserId(req:Request, res:Response){
    const {id}= req.params;
    const response= await findUserByIdService(Number(id));
    sendSuccess(res,response);
}

export async function createSingleUser(req:Request, res:Response){
    const dto: CreateUserDto= req.body;
    const response= await createUserByNameAndEmailService(dto);
    sendSuccess(res,response,201,'User created successfully');
}

export async function deleteSingleUser(req:Request,res:Response){
    const {id}= req.params;
    const response= await deleteUserByEmailService(Number(id));
    sendSuccess(res,response,201,'User deleted successfully');
}

export async function updateSingleUser(req:Request,res:Response){
    const {id}= req.params;
    const dto: UpdateUserDto= req.body;
    const response= await updateUserByEmailService(Number(id),dto);
    sendSuccess(res,response,201,'User updated successfully');
}