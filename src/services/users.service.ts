import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto.js";
import { createUser, deleteUser, getAllUsers, getUserByEmail, getUserById, updateUser } from "../repositories/user.repository.js";
import { badRequest, internalServerError, notFound } from "../utils/api-error.js";

export async function findAllUsers(){
    const users= await getAllUsers();
    return users; 
}

export async function findUserById(id:number){
    const user= await getUserById(id);
    if(!user){
        throw notFound('User not found');
    }
    return user;
}

export async function createUserByNameAndEmail(data:CreateUserDto){
    const response= await getUserByEmail(data.email);
    if(response){
        throw badRequest("User already exist with this Email");
    }
    const user= await createUser(data);
    if(!user){
        throw internalServerError('User not created');
    }
    return user;
}

export async function deleteUserByEmail(id:number){
    const response= await getUserById(id);
    if(!response){
        throw badRequest("User does not exist in the system");
    }
    const user= await deleteUser(id);
    if(!user){
        throw badRequest("User not deleted");
    }
    return user;
}

export async function updateUserByEmail(id:number, data:UpdateUserDto){
    const response= await getUserById(id);
    if(!response){
        throw notFound('User not found');
    }
    if(data.email){
    const res= await getUserByEmail(data.email);
    if(res){
        throw badRequest("This email is already taken");
    }
    }
    const user= await updateUser(id,data);
    if(!user){
        throw internalServerError("User not updated");
    }
    return user;
}
