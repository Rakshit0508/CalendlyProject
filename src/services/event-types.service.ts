import slug from "slug";
import { CreateEventTypeDto, UpdateEventTypeDto } from "../dtos/event-type.dto.js";
import { createEvent, findActiveEventByHostIdAndEventSlug, findEventsByHostId,
getEventById, removeEvent, eventSlugExistsForHost, updateEvent } from "../repositories/event-type.repository.js";
import { conflict, forbidden, notFound} from "../utils/api-error.js";
import { getUserById } from "../repositories/user.repository.js";

export async function listEventTypes(hostId:number){
    const eventTypes= await findEventsByHostId(hostId);
    return eventTypes;
}
export async function getEventByEventId(id:number){
    const eventType= await getEventById(id);
    if(!eventType){
        throw notFound(`Event with Id ${id} not found`);
    }
    return eventType;
}
export async function createEventType(hostId:number,data:CreateEventTypeDto){
    const slugPassed= data.slug ?? slug(data.title,{lower:true});
    if(!slugPassed){
        throw conflict('Could not generate a slug for the event type');
    }
    const isSlugTaken= await eventSlugExistsForHost(hostId,slugPassed);
    if(isSlugTaken){
        throw conflict('Event type with this slug already exists, please use a different slug')
    }
    return createEvent(hostId,{...data, slug:slugPassed});
}

export async function removeEventType(hostId: number,id:number){
    const eventType= await getEventById(id);
    if(!eventType){
        throw notFound('Event type not found');
    }
    if(eventType.hostId!==hostId){
        throw forbidden('You are not authorised to delete this event type');
    }
    return removeEvent(id);
}

export async function getEventTypePublic(hostId:number,eventSlug:string) {
    const eventType= await findActiveEventByHostIdAndEventSlug(hostId,eventSlug);
    if(!eventType){
        throw notFound('Event type not found');
    }
    const host= await getUserById(hostId);
    if(!host){
        throw notFound('User not found');
    }
    
    return{
        eventType:{
            id:eventType.id,
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

export async function updateEventType(hostId:number,id:number,data:UpdateEventTypeDto){
    const eventType= await getEventById(id);
    if(eventType && eventType.hostId!==hostId){
        throw forbidden('You are not authorized to update this event')
    }
    if(data.slug && data.slug!==eventType?.slug){
        const isSlugTaken= await eventSlugExistsForHost(hostId,data.slug);
        if(isSlugTaken){
            throw conflict('An event type with this slug already exists, please enter a different slug');
        }
    }
    return updateEvent(id,data);
}




