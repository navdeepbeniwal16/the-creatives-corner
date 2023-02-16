import express, { Request, Response, Router } from "express";
import { connections } from './data';
import { Connection } from "./models/connection";


const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
    const connectionQueryObject: any = req.query;
    const firstWriterId: number = req.body.writerId;

    if (Object.keys(connectionQueryObject).length > 0 && connectionQueryObject.with) { // check if second user is passed
        const secondWriterId = Number(connectionQueryObject.with);

        if (Number.isInteger(secondWriterId)) {
            const connectionBetweenWriters = connections.find(connection => {
                return connection.sourceUserId === firstWriterId && connection.targetUserId === secondWriterId ||
                    connection.sourceUserId == secondWriterId && connection.targetUserId === firstWriterId;
            })

            if (connectionBetweenWriters) {
                return res.json([connectionBetweenWriters]); // the api will return an array of connections no matter if its a single connection object between two writers
            } else {
                return res.status(404).json({ error: 'No connection found for the given writerId in the query' });
            }
        } else {
            return res.json({ error: 'Invalid \'with\' value in query' });
        }

    } else {
        const writersConnections: Connection[] = connections.filter(connection => connection.sourceUserId === firstWriterId || connection.targetUserId === firstWriterId);
        res.json(writersConnections);
    }
})

// TODO APIS:
// - POST: Api to create a connection
// - PUT: Api to update status of a connection

export { router as connectionsRouter };