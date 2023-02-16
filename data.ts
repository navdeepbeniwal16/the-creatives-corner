// TODO: Add email/username to the data as well to the processing code
import { Connection } from "./models/connection";
import { Writer } from "./writers";

// TODO: Refactor component to use connection to a database rather than reading data from JSON files.
import * as fs from "fs";

const writersData = fs.readFileSync('./data-files/writers.json');
const writersJsonDataArray = JSON.parse(writersData.toString());

const readWritersFromJsonArray = (writerJsonArray: any[]) => {
    const writers: Writer[] = [];
    writerJsonArray.forEach(object => {
        const writer: Writer = {
            id: object.id,
            name: object.name,
            email: object.email,
            nationalities: object.nationalities,
            bio: object.bio,
            genres: object.genres
        };
        writers.push(writer);
    })

    return writers;
}

export const writers: Writer[] = readWritersFromJsonArray(writersJsonDataArray);
console.log('Total writers : ' + writers.length);

const connectionsData = fs.readFileSync('./data-files/connections.json');
const connectionsJsonDataArray = JSON.parse(connectionsData.toString());

const readConnectionFromJsonArray = (connectionsJsonArray: any[]) => {
    const connections: Connection[] = [];
    connectionsJsonArray.forEach(object => {
        const connection: Connection = {
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
console.log('Total connections : ' + connections.length);


export const generateNewId = (collection: any[]) => {
    return collection.length + 1;
}

export const findById = (id: number, collection: any[]) => {
    const objectIndex = collection.findIndex(obj => obj.id === id)
    if (objectIndex !== -1) {
        return collection[objectIndex];
    } else {
        return null;
    }
}


export const updateById = (id: number, object: any, collection: any[]) => {
    const objectIndex = collection.findIndex(object => object['id'] === id);
    if (objectIndex !== -1) {
        collection[objectIndex] = object;
    } else {
        throw new Error(`Object with id : ${id} not found.`);
    }
}

export const deleteById = (id: number, collection: any[]) => {
    const objectIndex = collection.findIndex(object => object.id === id);
    if (objectIndex !== -1) {
        collection.splice(objectIndex, 1);
    } else {
        throw new Error(`Object with id : ${id} not found.`);
    }
}