import {prisma} from "../config/database.js"
import { CreateEventTypeDto, UpdateEventTypeDto } from "../dtos/event-type.dto.js";

export async function findEventsByUser(userId:number){
    const eventTypes= await prisma.eventType.findMany({
        where:{
            userId
        },
        orderBy:{
            createdAt:'desc'
        }
    });
    return eventTypes
}

export async function getEventById(eventTypeId:number){
    const eventType= await prisma.eventType.findUnique({
        where:{
            eventTypeId
        }
    })
    return eventType;
}

export async function createEvent(userId:number, data: CreateEventTypeDto & {slug:String}){
    const eventType= await prisma.eventType.create({
        data:{
            userId,
            ...data
        }
    })
    return eventType;
}

export async function updateEvent(eventTypeId:number, data:UpdateEventTypeDto){
    const eventType= await prisma.eventType.update({
        where:{
            eventTypeId
        },
        data
    })
    return eventType;
}

export async function removeEvent(eventTypeId:number){
    await prisma.eventType.delete({
        where:{
            eventTypeId
        }
    })
    return;
}

export async function findEventByHostAndSlug(userId:number,slug:string){
    const eventType= await prisma.eventType.findFirst({
        where:{
            userId,
            slug
        }
    })
    return eventType;
}

export async function findActiveEventByHostIdAndEventSlug(userId:number,slug:string){
    const eventType= await prisma.eventType.findFirst({
        where:{
            isActive:true,
            slug,
            userId
        }
    })
    return eventType;
}

export async function eventSlugExistsForHost(userId:number, slug:string){
    const existing= await prisma.eventType.findFirst({
        where:{
            userId,
            slug
        }
    })
    return existing!==null;
}

export async function findActiveEventTypesByHost(userId:number){
    return prisma.eventType.findMany({
        where:{
            userId,
            isActive:true
        }
    })
}


