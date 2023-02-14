export interface Writer {
    id: number,
    name: string,
    email: string,
    nationalities?: string[],
    genres?: string[],
    bio?: string
}

export const createWriter = (body: any): Writer => {
    if (!body.hasOwnProperty('id')) {
        throw new Error('Writer is missing \'id\'');
    }

    if (!body.hasOwnProperty('name')) {
        throw new Error('Writer is missing \'name\'');
    }

    if (!body.hasOwnProperty('email')) {
        throw new Error('Writer is missing \'email\'');
    }

    const writer: Writer = {
        id: body.id,
        name: body.name,
        email: body.email,
        nationalities: body.nationalities || [],
        bio: body.bio || null,
        genres: body.genres || []
    };

    return writer;
} 