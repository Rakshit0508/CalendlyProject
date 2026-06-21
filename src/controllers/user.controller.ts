import {Request, Response} from 'express';
import { createUserByNameAndEmail as createUserByNameAndEmailService, deleteUserByEmail as deleteUserByEmailService, findAllUsers as findAllUsersService, findUserById as findUserByIdService, updateUserByEmail as updateUserByEmailService} from '../services/users.service.js';


export async function findAllusers(_req:Request, res:Response){
    const response= await findAllUsersService();
    res.json(response);

}

export async function findUserId(req:Request, res:Response){
    const {id}= req.params;
    const response= await findUserByIdService(Number(id));
    res.json(response);
}

export async function createSingleUser(req:Request, res:Response){
    const {name,email}= req.body;
    const response= await createUserByNameAndEmailService(name,email);
    res.json(response);
}

export async function deleteSingleUser(req:Request,res:Response){
    const {email}= req.body;
    const response= await deleteUserByEmailService(email);
    res.json(response);
}

export async function updateSingleUser(req:Request,res:Response){
    const {newName,newEmail,email}= req.body;
    const response= await updateUserByEmailService(email,newName,newEmail);
    res.json(response);
}