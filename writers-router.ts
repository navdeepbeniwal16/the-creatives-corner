import express, { Request, Response, NextFunction, Router } from 'express';
import { writers, generateNewId, findById, updateById, deleteById, } from './data';
import { createWriter, Writer } from './writers';
import { connectionsRouter } from './connections-router';

const router: Router = express.Router();

router.use('/:id/connections', (req: Request, res: Response, next: NextFunction) => {
    const writerId: number = Number(req.params.id);

    if (!Number.isInteger(writerId)) { // typecheck : writerId passed in the path is not a number // TODO: Can probably shift this logic in a separate component
        return res.status(400).json({ message: 'Invalid writer id.' });
    }
    req.body.writerId = writerId;
    next();
}, connectionsRouter);

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    // TODO: Include search criteria based filtering

    res.json(writers);
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    const writerId: number = Number(req.params.id);

    if (!Number.isInteger(writerId)) { // typecheck : writerId passed in the path is not a number // TODO: Can probably shift this logic in a separate component
        return res.status(400).json({ message: 'Invalid writer id.' });
    }

    const writer: Writer = findById(writerId, writers);
    if (writer) {
        res.json(writer);
    } else {
        res.status(404).json({ message: WritersRouterErrors.WriterNotFound });
    }
})

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    const writerBody = req.body;

    // TODO: Add logic to validate and add email/username
    try {
        writerBody.id = generateNewId(writers);
        const writer: Writer = createWriter(writerBody);
        writers.push(writer);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }

    res.status(201).send();
})

router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    const writerId = Number(req.params.id);

    if (Number.isInteger(writerId)) {
        const writer = findById(writerId, writers);

        if (!writer) {
            res.status(404).json({ message: WritersRouterErrors.WriterNotFound });
        } else {
            const updatedWriterBody = req.body;

            try {
                updatedWriterBody.id = writerId;
                const updatedWriter = createWriter(updatedWriterBody);
                updateById(writerId, updatedWriter, writers);
            } catch (error: any) {
                res.status(400).json({ message: error.message });
                return;
            }

            res.status(200).json(findById(writerId, writers));
        }
    } else {
        res.status(400).json({ message: WritersRouterErrors.InvalidId });
    }
});

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    const writerId = Number(req.params.id);
    if (Number.isInteger(writerId)) {
        try {
            deleteById(writerId, writers);
            res.status(204).send();
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    } else {
        res.status(400).json({ message: WritersRouterErrors.InvalidId });
    }
})

enum WritersRouterErrors {
    InvalidId = 'Invalid writer id.',
    WriterNotFound = `Writer with the given id not found`,

}

export { router as writersRouter };