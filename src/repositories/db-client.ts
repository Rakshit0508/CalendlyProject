import { PrismaClient } from "@prisma/client/extension";
import {prisma} from "../config/database.js";
import { Prisma } from "@prisma/client";

export type DbClient= PrismaClient | Prisma.TransactionClient;

export function getDbClient(db?: DbClient):DbClient{
    return db?? prisma;
}