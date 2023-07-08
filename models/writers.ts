import { v4 as uuidv4 } from 'uuid';

export interface Writer {
    id: string,
    name: string,
    email: string,
    nationalities?: string[],
    genres?: string[],
    bio?: string
}

export const createWriter = (body: any): Writer => {
    if (!body.hasOwnProperty('name')) {
        throw new Error('Writer is missing \'name\'');
    }

    if (!body.hasOwnProperty('email')) {
        throw new Error('Writer is missing \'email\'');
    }

    const writer: Writer = {
        // id: id || uuidv4(),
        id: uuidv4(),
        name: body.name,
        email: body.email,
        nationalities: body.nationalities || [],
        bio: body.bio || null,
        genres: body.genres || []
    };

    return writer;
}

export const updateWriter = (writer: Writer, updatedWriterBody: any): Writer => {
    if (updatedWriterBody.hasOwnProperty('name') && updatedWriterBody['name']) {
        writer.name = updatedWriterBody['name'];
    }

    if (updatedWriterBody.hasOwnProperty('email') && updatedWriterBody['email']) {
        writer.email = updatedWriterBody['email'];
    }

    if (updatedWriterBody.hasOwnProperty('nationalities')) {
        writer.nationalities = updatedWriterBody['nationalities'];
    }

    if (updatedWriterBody.hasOwnProperty('bio')) {
        writer.bio = updatedWriterBody['bio'];
    }

    if (updatedWriterBody.hasOwnProperty('genres')) {
        writer.genres = updatedWriterBody['genres'];
    }

    return writer;
}