import express, { Request, Response, NextFunction, Router } from 'express';
import { writers, findById, updateById, deleteById, find, } from '../data';
import { createWriter, updateWriter, Writer } from '../models/writers';

const router: Router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validateUser = (req: Request, res: Response, next: NextFunction) => {
    jwt.verify(req.headers['x-access-token'], process.env.TOKEN_SECRET, (err: Error, decoded: any) => {
        if (err) {
            res.status(401).json({ error: err.message });
        } else {
            // add user id to request
            const decodedData = JSON.parse(decoded.data);
            req.body.userId = decodedData.id;
            console.log(`Authenticated UserId: ${req.body.userId}`);
            next();
        }
    });
}

router.param('writerId', (req, res, next, id) => {
    const writer: Writer = findById(id, writers);
    try {
        if (writer) {
            req.body.writer = writer;
            next();
        } else {
            return res.status(404).json({ error: WritersRouterErrors.WriterNotFound });
        }
    } catch (error) {
        return res.status(500).send();
    }

})

router.post('/login', async (req: Request, res: Response) => {
    if (!req.body.hasOwnProperty('email') || !req.body['email']) {
        return res.status(404).json({ error: 'Request body is missing \'email\'' });
    }

    if (!req.body.hasOwnProperty('password') || !req.body['password']) {
        return res.status(404).json({ error: 'Request body is missing \'password\'' });
    }

    const email: String = req.body.email;
    const password: String = req.body.password;

    const writer: Writer | null = find(writers, (writerObj) => writerObj.email === email);
    if (writer === null) {
        return res.status(404).json({ error: WritersRouterErrors.WriterNotFound });
    }

    try {
        const match = await bcrypt.compare(password, writer.password);
        const accessToken = jwt.sign({ data: JSON.stringify(writer) }, process.env.TOKEN_SECRET, { expiresIn: '1h' })
        if (match) {
            res.json({ accessToken: accessToken });
        } else {
            res.status(401).json({ error: WritersRouterErrors.InvalidWriterCredentials });
        }
    } catch (e) {
        console.log(`Error occured while loging in user`);
        console.log(e)
    }
})

router.get('/', validateUser, (req: Request, res: Response, next: NextFunction) => {
    // TODO: Include search criteria based filtering

    res.json(writers);
});

router.get('/:writerId', validateUser, (req: Request, res: Response) => {
    res.json(req.body.writer);
})

// api to create a new writer
router.post('/', async (req: Request, res: Response) => {
    const writerBody = req.body;

    try {
        // hashing password and storing hashed password to the body
        if (!req.body.hasOwnProperty('password') || !req.body['password']) {
            throw new Error('Writer is missing \'password\'');
        }

        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        writerBody.hashedPassword = hashedPassword;

        const writerToCreate: Writer = createWriter(writerBody);
        const writerIndex = writers.findIndex(writerObject => writerObject.email === writerToCreate.email);
        if (writerIndex !== -1) {
            return res.status(400).json({ error: WritersRouterErrors.WriterExists })
        }
        writers.push(writerToCreate);
        res.status(201).json(writerToCreate);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
})

router.put('/:writerId', validateUser, (req: Request, res: Response) => {
    const writerId = req.params.writerId;
    const updatedWriterBody = req.body;
    const writer: Writer = req.body.writer;
    try {
        const updatedWriter = updateWriter(writer, updatedWriterBody);
        updateById(writerId, updatedWriter, writers);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
        return;
    }

    res.status(200).json(findById(writerId, writers));
});

router.delete('/:writerId', validateUser, (req: Request, res: Response, next: NextFunction) => {
    const writerId = req.params.writerId;

    try {
        deleteById(writerId, writers);
        res.status(204).send();
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
})

enum WritersRouterErrors {
    WriterExists = 'Writer with the given email already exists',
    WriterNotFound = `Writer not found`,
    InvalidWriterCredentials = `Invalid writer credentials`
}

export { router as writersRouter };