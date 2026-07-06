import { CreateAvailabilityExceptionDto, CreateAvailabilityRuleDto, UpdateAvailabilityExceptionDto, UpdateAvailabilityRuleDto } from "../dtos/availability.dto.js";
import { createException, createRule, findExceptionById, findExceptionsByUser, findExceptionsByUserInRange, findRuleById, findRulesByUser, removeException, removeRule, updateException, updateRule } from "../repositories/availability.repository.js";
import { getUserById } from "../repositories/user.repository.js";
import { notFound, unauthorized } from "../utils/api-error.js";

export async function findAvailabilityRulesByUser(userId:number){
    const user= await getUserById(userId);
    if(!user){
        throw notFound("User not found");
    }
    return findRulesByUser(userId);
}

export async function findAvailabilityRulesById(ruleId:number){
    return findRuleById(ruleId);
}

export async function createAvailabilityRule(userId:number,data:CreateAvailabilityRuleDto){
    const user= await getUserById(userId);
    if(!user){
        throw notFound("User not found");
    }
    return createRule(userId,data);
}

export async function updateAvailabilityRule(userId:number,ruleId:number,data:UpdateAvailabilityRuleDto){
    const user= await getUserById(userId);
    if(!user){
        throw notFound("User not found");
    }
    const response= await findRuleById(ruleId);
    if(!response){
        throw notFound("Availability rule not found")
    }
    if(response && response.userId!==userId){
        throw unauthorized("You are not authorized to update this availability rule")
    }
    return updateRule(ruleId,data);
}

export async function removeAvailabilityRule(userId:number,ruleId:number){
    const user= await getUserById(userId);
    if(!user){
        throw notFound("User not found");
    }
    const response= await findRuleById(ruleId);
    if(!response){
        throw notFound("Availability rule not found")
    }
    if(response && response.userId!==userId){
        throw unauthorized("You are not authorized to remove this availability rule")
    }
    return removeRule(ruleId);
}

export async function findAvailabilityExceptionsByUser(userId:number){
    const user= await getUserById(userId);
    if(!user){
        throw notFound("User not found");
    }
    return findExceptionsByUser(userId);
}

export async function findAvailabilityExceptionById(exceptionId:number){
    return findExceptionById(exceptionId);
}

export async function createAvailabilityException(userId:number, data:CreateAvailabilityExceptionDto){
    const user= await getUserById(userId);
    if(!user){
        throw notFound("User not found");
    }
    return createException(userId,data);
}

export async function updateAvailabilityException(userId:number,exceptionId:number,data:UpdateAvailabilityExceptionDto){
    const user= await getUserById(userId);
    if(!user){
        throw notFound("User not found");
    }
    const response= await findExceptionById(exceptionId);
    if(!response){
        throw notFound("Availability exception not found")
    }
    if(response && response.userId!==userId){
        throw unauthorized("You are not authorized to update this availability exception")
    }
    return updateException(exceptionId,data);
}

export async function removeAvailabilityException(userId:number,exceptionId:number){
    const user= await getUserById(userId);
    if(!user){
        throw notFound("User not found");
    }
    const response= await findExceptionById(exceptionId);
    if(!response){
        throw notFound("Availability exception not found")
    }
    if(response && response.userId!==userId){
        throw unauthorized("You are not authorized to delete this availability exception")
    }
    return removeException(exceptionId);
}

export async function findAvailabilityExceptionsByUserInRange(userId:number,startDate:Date,endDate:Date){
    const user= await getUserById(userId);
    if(!user){
        throw notFound("User not found");
    }
    return findExceptionsByUserInRange(userId,startDate,endDate);
}