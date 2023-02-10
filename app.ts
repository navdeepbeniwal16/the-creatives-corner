import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { writers, findById, updateById, deleteById } from './data.js';

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

app.get('/writers', (req: Request, res: Response, next: NextFunction) => {
    // TODO: Include search criteria based filtering

    res.json(writers);
});

app.get('/writers/:id', (req, res, next) => {
    const writerId = Number(req.params.id);
    if (!writerId) { // typecheck : writerId passed in the path is not a number
        res.status(400).json({ message: 'Invalid writer id.' });
    }

    const writer = findById(writerId, writers);
    if (writer) {
        res.json(writer);
    } else {
        res.status(404).json({ message: `Writer with id : ${writerId} not found` });
    }
})

app.post('/writers', (req, res, next) => {
    const writerBody = req.body;
    console.log('Writer body : ');
    console.log(writerBody);

    // TODO: Add logic to validate and add email/username

    if (!writerBody || isEmptyObject(writerBody)) {
        res.status(400).json({ message: 'Empty request body' });
        return;
    }

    try {
        validateWriterObject(writerBody);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }

    // const writer = createWriterObject(writerBody, getNewWriterId());
    const writer = {
        id: getNewWriterId(),
        name: writerBody.name,
        email: writerBody.email,
        nationalities: writerBody.nationalities,
        genres: writerBody.genres,
        bio: writerBody.bio
    }
    // writers.push(writer);
    writers.push(writer);
    res.status(201).send();

})

app.put('/writers/:id', (req, res, next) => {
    const writerId = Number(req.params.id);

    if (Number.isInteger(writerId)) {
        const writer = findById(writerId, writers);

        if (!writer) {
            res.status(404).json({ message: `Writer with id ${writerId} not found.` });
        } else {
            const updatedWriterBody = req.body;

            try {
                validateWriterObject(updatedWriterBody);
            } catch (error: any) {
                res.status(400).json({ message: error.message });
                return;
            }

            const updatedWriterObject = createWriterObject(updatedWriterBody, writerId);
            updateById(writerId, updatedWriterObject, writers);
            res.status(200).json(findById(writerId, writers));
        }
    } else {
        res.status(400).json({ message: `Invalid writer id.` });
    }
});

app.delete('/writers/:id', (req, res, next) => {
    const writerId = Number(req.params.id);
    if (Number.isInteger(writerId)) {
        try {
            deleteById(writerId, writers);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ message: `Writer with id ${writerId} not found.` });
        }
    } else {
        res.status(400).json({ message: `Invalid writer id.` });
    }
})

const validateWriterObject = (body: any) => {
    if (
        !body.hasOwnProperty('name') ||
        !body.hasOwnProperty('nationalities')
    ) {
        throw new Error('Missing any of the required properties i.e. name, nationalities');
    }

    return true;
}

const createWriterObject = (body: any, id: number) => {
    return {
        id: id ? id : getNewWriterId(),
        name: body.name,
        nationalities: body.nationalities ? body.nationalities : [],
        genres: body.genres ? body.genres : [],
        bio: body.bio ? body.bio : ''
    }
}

const isEmptyObject = (obj: any) => {
    return Object.keys(obj).length == 0;
}

const getNewWriterId = () => {
    return writers.length + 1;
}

app.listen(PORT, () => {
    console.log(`Server is listening on PORT : ${PORT}`);
});


// TODOS :
/*
- Have a component or function to construct error messages to pass back to user
- Defining the error messages seperately either as class or as enums
- Request validator to validate incoming request data and type
*/