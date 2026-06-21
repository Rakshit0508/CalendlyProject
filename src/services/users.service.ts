import { createUser, deleteUser, getAll, getByEmail, getById, updateUser } from "../repositories/user.repository.js";
import { badRequest, notFound } from "../utils/api-error.js";

export async function findAllUsers(){
    const users= await getAll();
    return users; 
}

export async function findUserById(id:number){
    const user= await getById(id);
    if(!user){
        throw notFound('User not found');
    }
    return user;
}

export async function createUserByNameAndEmail(name:string,email:string){
    const response= await getByEmail(email);
    if(response){
        throw badRequest("User already exist with this Email");
    }
    const user= await createUser(name,email);
    if(!user){
        throw notFound('User not found');
    }
    return user;
}

export async function deleteUserByEmail(email:string){
    const response= await getByEmail(email);
    if(!response){
        throw badRequest("User does not exist in the system");
    }
    const user= await deleteUser(email);
    if(!user){
        throw badRequest("User not deleted");
    }
    return user;
}

export async function updateUserByEmail(email:string,newEmail:string,newName:string){
    const response= await getByEmail(email);
    if(!response){
        throw notFound('User not found');
    }
    const res= await getByEmail(newEmail);
    if(res){
        throw badRequest("This email is already taken");
    }
    const user= await updateUser(email,newEmail,newName);
    if(!user){
        throw badRequest("User not updated");
    }
    return user;
}