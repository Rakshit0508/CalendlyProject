import {prisma} from "../config/database.js"
import { CreateEventTypeDto, UpdateEventTypeDto } from "../dtos/event-type.dto.js";

export async function findEventsByHostId(hostId:number){
    const eventTypes= await prisma.eventType.findMany({
        where:{
            hostId
        },
        orderBy:{
            createdAt:'desc'
        }
    });
    return eventTypes
}

export async function getEventById(id:number){
    const eventType= await prisma.eventType.findUnique({
        where:{
            id
        }
    })
    return eventType;
}

export async function createEvent(hostId:number, data: CreateEventTypeDto & {slug:String}){
    const eventType= await prisma.eventType.create({
        data:{
            hostId,
            ...data
        }
    })
    return eventType;
}

export async function updateEvent(id:number, data:UpdateEventTypeDto){
    const eventType= await prisma.eventType.update({
        where:{
            id
        },
        data
    })
    return eventType;
}

export async function removeEvent(id:number){
    await prisma.eventType.delete({
        where:{
            id
        }
    })
    return;
}

export async function findEventByHostAndSlug(hostId:number,slug:string){
    const eventType= await prisma.eventType.findFirst({
        where:{
            hostId,
            slug
        }
    })
    return eventType;
}

export async function findActiveEventByHostIdAndEventSlug(hostId:number,slug:string){
    const eventType= await prisma.eventType.findFirst({
        where:{
            isActive:true,
            slug,
            hostId
        }
    })
    return eventType;
}

export async function eventSlugExistsForHost(hostId:number, slug:string){
    const existing= await prisma.eventType.findFirst({
        where:{
            hostId,
            slug
        }
    })
    return existing!==null;
}




