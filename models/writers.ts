import { v4 as uuidv4 } from 'uuid';

export interface Writer {
    id: string,
    name: string,
    email: string,
    nationalities?: string[],
    genres?: string[],
    bio?: string
}

export const createWriter = (body: any, id?: string): Writer => {
    if (!body.hasOwnProperty('name')) {
        throw new Error('Writer is missing \'name\'');
    }

    if (!body.hasOwnProperty('email')) {
        throw new Error('Writer is missing \'email\'');
    }

    const writer: Writer = {
        id: id || uuidv4(),
        name: body.name,
        email: body.email,
        nationalities: body.nationalities || [],
        bio: body.bio || null,
        genres: body.genres || []
    };

    return writer;
} 