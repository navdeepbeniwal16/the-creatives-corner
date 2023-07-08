import express, { Request, Response, NextFunction, Router } from 'express';
import { writers, findById, updateById, deleteById, } from '../data';
import { createWriter, updateWriter, Writer } from '../models/writers';

const router: Router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    // TODO: Include search criteria based filtering

    res.json(writers);
});

router.get('/:writerId', (req: Request, res: Response) => {
    res.json(req.body.writer);
})

// api to create a new writer
router.post('/', (req: Request, res: Response) => {
    const writerBody = req.body;

    try {
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

router.put('/:writerId', (req: Request, res: Response) => {
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

router.delete('/:writerId', (req: Request, res: Response, next: NextFunction) => {
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
    WriterNotFound = `Writer with the given id not found`,
}

export { router as writersRouter };