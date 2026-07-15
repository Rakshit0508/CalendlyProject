import slug from "slug";
import { CreateEventTypeDto, UpdateEventTypeDto } from "../dtos/event-type.dto.js";
import { createEvent, findActiveEventByHostIdAndEventSlug, findEventsByUser,
getEventById, removeEvent, eventSlugExistsForHost, updateEvent, findActiveEventTypesByHost } from "../repositories/event-type.repository.js";
import { conflict, forbidden, notFound} from "../utils/api-error.js";
import { getUserById } from "../repositories/user.repository.js";
import { startRegenerateHostSlotsWorkflow } from "../temporal/client.js";

export async function listEventTypes(userId:number){
    const eventTypes= await findEventsByUser(userId);
    return eventTypes;
}
export async function getEventByEventId(eventTypeId:number){
    const eventType= await getEventById(eventTypeId);
    if(!eventType){
        throw notFound(`Event with Id ${eventTypeId} not found`);
    }
    return eventType;
}
export async function createEventType(userId:number,data:CreateEventTypeDto){
    const slugPassed= data.slug ?? slug(data.title,{lower:true});
    if(!slugPassed){
        throw conflict('Could not generate a slug for the event type');
    }
    const isSlugTaken= await eventSlugExistsForHost(userId,slugPassed);
    if(isSlugTaken){
        throw conflict('Event type with this slug already exists, please use a different slug')
    }
    const eventType= createEvent(userId,{...data, slug:slugPassed});
    await startRegenerateHostSlotsWorkflow({userId});
    return eventType;
}

export async function removeEventType(userId: number,eventTypeId:number){
    const eventType= await getEventById(eventTypeId);
    if(!eventType){
        throw notFound('Event type not found');
    }
    if(eventType.userId!==userId){
        throw forbidden('You are not authorised to delete this event type');
    }
    return removeEvent(eventTypeId);
}

export async function getEventTypePublic(userId:number,eventSlug:string) {
    const host= await getUserById(userId);
    if(!host){
        throw notFound('User not found');
    }
    const eventType= await findActiveEventByHostIdAndEventSlug(userId,eventSlug);
    if(!eventType){
        throw notFound('Event type not found');
    }
    
    return{
        eventType:{
            eventTypeId:eventType.eventTypeId,
            title:eventType.title,
            description: eventType.description,
            durationMinutes: eventType.durationMinutes,
            locationType: eventType.locationType
        },
        host:{
            name:host.name,
            email: host.email
        }
    }
}

export async function updateEventType(userId:number,eventTypeId:number,data:UpdateEventTypeDto){
    const eventType= await getEventById(eventTypeId);
    if(eventType && eventType.userId!==userId){
        throw forbidden('You are not authorized to update this event')
    }
    if(data.slug && data.slug!==eventType?.slug){
        const isSlugTaken= await eventSlugExistsForHost(userId,data.slug);
        if(isSlugTaken){
            throw conflict('An event type with this slug already exists, please enter a different slug');
        }
    }
    return updateEvent(eventTypeId,data);
}

export async function findActiveEventTypesByHostId(userId:number){
    const host= await getUserById(userId);
    if(!host){
        throw notFound('User not found');
    }
    return findActiveEventTypesByHost(userId);
}


