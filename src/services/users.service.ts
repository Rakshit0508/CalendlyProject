import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto.js";
import { createUser, deleteUser, getAllUsers, getUserByEmail, getUserById, slugExistInUserDb, updateUser } from "../repositories/user.repository.js";
import { badRequest, notFound, conflict } from "../utils/api-error.js";
import slug from "slug";

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
    const slugPassed= data.slug ?? slug(data.name,{lower:true}); // make the slug unique (system design of url shortner)
    if(!slugPassed){
        throw conflict('Could not generate a slug for the user');
    }
    const isSlugTaken= await slugExistInUserDb(slugPassed);
    if(isSlugTaken){
        throw conflict('A user with this slug already exists, please use a different slug')
    }
    return createUser({...data,slug:slugPassed});
}

export async function deleteUserByEmail(id:number){
    const response= await getUserById(id);
    if(!response){
        throw badRequest("User does not exist in the system");
    }
    return await deleteUser(id);
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
    if(data.slug && data.slug!==response.slug){
        const isSlugTaken= await slugExistInUserDb(data.slug);
        if(isSlugTaken){
            throw conflict('A user with this slug already exists, please enter a different slug');
        }
    }
    return await updateUser(id,data);
}
