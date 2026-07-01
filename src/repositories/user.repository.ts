import {prisma} from "../config/database.js"
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto.js";

export async function getAllUsers(){
    const users= await prisma.user.findMany();
    return users;
}

export async function getUserById(id:number){
    const user= await prisma.user.findUnique({
        where:{
            id
        }
    })
    return user;
}

export async function getUserByEmail(email:string){
    const user= await prisma.user.findUnique({
        where:{
            email
        }
    })
    return user;
}

export async function createUser(data: CreateUserDto){
    const user= await prisma.user.create({
        data
    })
    return user;
}

export async function deleteUser(id:number){
    const user= await prisma.user.delete({
        where:{
            id
        }
    })
    return user;
}

export async function updateUser(id:number, data:UpdateUserDto){
    const user= await prisma.user.update({
        where:{
            id
        },
        data
    })
    return user;
}
