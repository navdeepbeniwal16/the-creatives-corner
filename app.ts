import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { writersRouter } from './writers-router.js';

const app: Express = express();
app.use(bodyParser.json());

const PORT = 3000;

app.use('/', (req: Request, res: Response, next: NextFunction) => {
    if ((req.method === 'POST' || req.method === 'PUT') && isEmptyObject(req.body)) {
        res.status(400).json({ message: 'Empty request body' });
        return;
    }

    next();
})

app.use('/writers', writersRouter)

app.listen(PORT, () => {
    console.log(`Server is listening on PORT : ${PORT}`);
});

const isEmptyObject = (obj: any) => {
    return Object.keys(obj).length == 0;
}

// TODOS :
/*
- Have a component or function to construct error messages to pass back to user
*/