// TODO: Add email/username to the data as well to the processing code
import { Connection } from "./models/connection";
import { Writer } from "./models/writers";

// TODO: Refactor component to use connection to a database rather than reading data from JSON files.
import * as fs from "fs";
import { v4 as uuidv4 } from 'uuid';

const writersData = fs.readFileSync('./data-files/writers.json');
const writersJsonDataArray = JSON.parse(writersData.toString());

const readWritersFromJsonArray = (writerJsonArray: any[]) => {
    const writers: Writer[] = [];
    writerJsonArray.forEach(object => {
        const writer: Writer = {
            id: uuidv4(),
            name: object.name,
            email: object.email,
            password: object.password,
            nationalities: object.nationalities,
            bio: object.bio,
            genres: object.genres
        };
        writers.push(writer);
    })

    return writers;
}

export const writers: Writer[] = readWritersFromJsonArray(writersJsonDataArray);

const connectionsData = fs.readFileSync('./data-files/connections.json');
const connectionsJsonDataArray = JSON.parse(connectionsData.toString());

const readConnectionFromJsonArray = (connectionsJsonArray: any[]) => {
    const connections: Connection[] = [];
    connectionsJsonArray.forEach(object => {
        const connection: Connection = {
            id: uuidv4(),
            dateCreated: object.dateCreated,
            sourceUserId: object.sourceUserId,
            targetUserId: object.targetUserId,
            status: object.status
        };
        connections.push(connection);
    })

    return connections;
}

export const connections: Connection[] = readConnectionFromJsonArray(connectionsJsonDataArray);


export const generateNewId = (collection: any[]) => {
    return collection.length + 1;
}

export const findById = (id: string, collection: any[]) => {
    const objectIndex = collection.findIndex(obj => obj.id === id)
    if (objectIndex !== -1) {
        return collection[objectIndex];
    } else {
        return null;
    }
}

export const find = (collection: any[], predicate: (element: any) => boolean) => {
    const objectIndex = collection.findIndex(object => predicate(object));
    if (objectIndex !== -1) {
        return collection[objectIndex];
    } else {
        return null;
    }
}


export const updateById = (id: string, object: any, collection: any[]) => {
    const objectIndex = collection.findIndex(object => object['id'] === id);
    if (objectIndex !== -1) {
        collection[objectIndex] = object;
    } else {
        throw new Error(`Object with id : ${id} not found.`);
    }
}

export const deleteById = (id: string, collection: any[]) => {
    const objectIndex = collection.findIndex(object => object.id === id);
    if (objectIndex !== -1) {
        collection.splice(objectIndex, 1);
    } else {
        throw new Error(`Object with id : ${id} not found.`);
    }
}