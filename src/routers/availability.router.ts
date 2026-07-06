import { Router } from "express";
import { requireUserId } from "../middlewares/require-user-id.js";
import { createAvailabilityRule, createAvailalbilityException, findAvailabilityExceptionById, findAvailabilityExceptionsByUser, findAvailabilityExceptionsByUserInRange, findAvailabilityRulesById, findAvailabilityRulesByUser, removeAvailabilityException, removeAvailabilityRule, updateAvailabilityException, updateAvailabilityRule } from "../controllers/availability.controller.js";


export const availabilityRouter:Router= Router({mergeParams:true});

availabilityRouter.use(requireUserId);

availabilityRouter.get('/rules',findAvailabilityRulesByUser);
availabilityRouter.get('/rule/:ruleId',findAvailabilityRulesById);
availabilityRouter.post('/rule',createAvailabilityRule);
availabilityRouter.patch('/rule/:ruleId',updateAvailabilityRule);
availabilityRouter.delete('/rule/:ruleId',removeAvailabilityRule);

availabilityRouter.get('/exceptions',findAvailabilityExceptionsByUser);
availabilityRouter.get('/exception/:exceptionId',findAvailabilityExceptionById);
availabilityRouter.post('/exception',createAvailalbilityException);
availabilityRouter.patch('/exception/:exceptionId',updateAvailabilityException);
availabilityRouter.delete('/exception/:exceptionId',removeAvailabilityException);
availabilityRouter.get('/exceptions/range',findAvailabilityExceptionsByUserInRange);