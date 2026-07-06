import {prisma} from "../config/database.js"
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto.js";

export async function getAllUsers(){
    const users= await prisma.user.findMany();
    return users;
}

export async function getUserById(userId:number){
    const user= await prisma.user.findUnique({
        where:{
            userId
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

export async function createUser(data: CreateUserDto & {slug:string}){
    const user= await prisma.user.create({
        data
    })
    return user;
}

export async function deleteUser(userId:number){
    await prisma.user.delete({
        where:{
            userId
        }
    })
}

export async function updateUser(userId:number, data:UpdateUserDto){
    const user= await prisma.user.update({
        where:{
            userId
        },
        data
    })
    return user;
}

export async function slugExistInUserDb(slug:string){
    const isSlugExist= await prisma.user.findFirst({
        where:{
            slug
        }
    })
    return isSlugExist!==null
}