import { CreateAvailabilityExceptionDto, CreateAvailabilityRuleDto,UpdateAvailabilityExceptionDto,UpdateAvailabilityRuleDto } from "../dtos/availability.dto.js";
import {prisma} from "../config/database.js"

export async function findRulesByUser(userId:number){
    return await prisma.availabilityRule.findMany({
        where:{
            userId
        },
        orderBy:[{
            weekday:"asc"
        },{
            startTime:"asc"
        }]
    })
}

export async function findRuleById(id:number){
    return await prisma.availabilityRule.findUnique({
        where:{
            id
        }
    })
}

export async function createRule(userId: number,data: CreateAvailabilityRuleDto){
    return await prisma.availabilityRule.create({
        data:{
            userId,
            ...data
        }
    })
}

export async function updateRule(id:number,data:UpdateAvailabilityRuleDto) {
    return await prisma.availabilityRule.update({
        where:{id},
        data
    })
}

export async function removeRule(id:number){
    await prisma.availabilityRule.delete({
        where:{id}
    })
}

export async function findExceptionsByUser(userId:number){
    return await prisma.availabilityException.findMany({
        where:{
            userId
        },
        orderBy:{
            date:"asc",
            startTime:"asc"
        }
    })
}

export async function findExceptionById(id:number){
    return await prisma.availabilityException.findUnique({
        where:{
            id
        }
    })
}

export async function createException(userId:number,data:CreateAvailabilityExceptionDto){
    const {date,...rest}=data;
    return await prisma.availabilityException.create({
        data:{
            userId,
            ...rest,
            date: new Date(`${date}T00:00:00.00Z`),
        }
    })
}

export async function updateException(id:number,data:UpdateAvailabilityExceptionDto){
    const {date,...rest}= data;
    return await prisma.availabilityException.update({
        where:{
            id
        },
        data:{
            ...rest,
            ...(date!== undefined && {date: new Date(`${date}T00:00:00.00Z`)}),
        }
    })
}

export async function removeException(id:number){
    await prisma.availabilityException.delete({
        where:{
            id
        }
    })
}

export async function findExceptionsByUserInRange(userId:number,startDate:Date,endDate:Date){
    return await prisma.availabilityException.findMany({
        where:{
            userId,
            date:{
                gte:startDate,
                lte:endDate
            },
        },
        orderBy:{
            date:"asc"
        }
    })
}
