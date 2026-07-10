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

export async function findActiveRulesByUser(userId:number){
    return await prisma.availabilityRule.findMany({
        where:{
            userId, isActive:true
        },
        orderBy:[{
            weekday:"asc"
        },{
            startTime:"asc"
        }]
    })
}

export async function findRuleById(ruleId:number){
    return await prisma.availabilityRule.findUnique({
        where:{
            ruleId
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

export async function updateRule(ruleId:number,data:UpdateAvailabilityRuleDto) {
    return await prisma.availabilityRule.update({
        where:{ruleId},
        data
    })
}

export async function removeRule(ruleId:number){
    await prisma.availabilityRule.delete({
        where:{ruleId}
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

export async function findExceptionById(exceptionId:number){
    return await prisma.availabilityException.findUnique({
        where:{
            exceptionId
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

export async function updateException(exceptionId:number,data:UpdateAvailabilityExceptionDto){
    const {date,...rest}= data;
    return await prisma.availabilityException.update({
        where:{
            exceptionId
        },
        data:{
            ...rest,
            ...(date!== undefined && {date: new Date(`${date}T00:00:00.00Z`)}),
        }
    })
}

export async function removeException(exceptionId:number){
    await prisma.availabilityException.delete({
        where:{
            exceptionId
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
