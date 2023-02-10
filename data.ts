// TODO: Add email/username to the data as well to the processing code

export const writers: any[] = [
    {
        id: 1,
        name: 'Margaret Atwood',
        email: 'margaretatwood@tcc.com',
        nationalities: ['British'],
        genres: ['dystopian fiction', 'speculative fiction', 'feminist literature'],
        bio: 'Margaret Atwood is a Canadian author, poet, and literary critic, known for her dystopian novels such as "The Handmaid\'s Tale" and "The MaddAddam Trilogy."'
    },
    {
        id: 2,
        name: 'James Baldwin',
        email: 'jamesbaldwin@tcc.com',
        nationalities: ['American'],
        genres: ['american literature', 'african american literature', 'lgbt literature'],
        bio: 'James Baldwin was an American novelist, playwright, and civil rights activist, known for works such as "Go Tell It on the Mountain" and "The Fire Next Time" that explored themes of race and identity.'
    },
    {
        id: 3,
        name: 'Toni Morrison',
        email: 'tonimorrison@tcc.com',
        nationalities: ['American'],
        genres: ['african american literature', 'american literature', 'feminist literature'],
        bio: 'Toni Morrison was an American novelist, editor, and professor, known for her exploration of black identity in works such as "Beloved," "Jazz," and "Sula."'
    },
    {
        id: 4,
        name: 'Gabriel Garcia Marquez',
        email: 'gabrielgarciamarquez@tcc.com',
        nationalities: ['Colombian', 'Mexican'],
        genres: ['magical realism', 'latin american literature', 'world literature'],
        bio: 'Gabriel Garcia Marquez was a Colombian novelist, short-story writer, and journalist, known for his magical realism style in works such as "One Hundred Years of Solitude" and "Love in the Time of Cholera."'
    },
    {
        id: 5,
        name: 'Chinua Achebe',
        email: 'chinuaachebe@tcc.com',
        nationalities: ['Nigerian'],
        genres: ['african literature', 'postcolonial literature', 'cultural criticism'],
        bio: 'Chinua Achebe was a Nigerian novelist, poet, and critic, known for his portrayal of the effects of colonialism on traditional Igbo society in works such as "Things Fall Apart" and "No Longer at Ease."'
    }
];

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

// module.exports = {
//     writers : writers,
//     findById : findById,
//     updateById : updateById,
//     deleteById : deleteById
// }