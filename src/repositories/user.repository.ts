import {prisma} from "../config/database.js"

export async function getAll(){
    const users= await prisma.user.findMany();
    return users;
}

export async function getById(id:number){
    const user= await prisma.user.findUnique({
        where:{
            id
        }
    })
    return user;
}

export async function getByEmail(email:string){
    const user= await prisma.user.findUnique({
        where:{
            email
        }
    })
    return user;
}

export async function createUser(name:string, email:string){
    const user= await prisma.user.create({
        data:{
            name, email
        }
    })
    return user;
}

export async function deleteUser(email:string){
    const user= await prisma.user.delete({
        where:{
            email
        }
    })
    return user;
}

export async function updateUser(email:string, newEmail:string, newName:string){
    const user= await prisma.user.update({
        where:{
            email
        },
        data:{
            name: newName,
            email: newEmail
        }
    })
    return user;
}
