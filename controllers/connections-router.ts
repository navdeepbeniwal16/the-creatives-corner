import express, { Request, Response, Router } from "express";
import { connections, findById, updateById } from '../data';
import { Connection, Status, createConnection, getStatusFromString as getConnectionStatusFromString, updateConnectionStatus, validateStatus as validateConnectionStatus, validateConnection } from "../models/connection";

const router: Router = express.Router();

// Middleware to find connection associated to the connectionId and attach it to req.body
router.param('connectionId', (req, res, next, id) => {
    const connection: Connection = findById(id, connections);
    try {
        if (connection) {
            req.body.connection = connection;
            next();
        } else {
            return res.status(404).json({ error: ConnectionsRouterErrors.ConnectionNotFound });
        }
    } catch (error) {
        return res.status(500).send();
    }
})

/**
 * Route middleware to query connections objects of single user or between two different users
 * eg GET -> /connections?of=321eae40-bdff-4826-869d-ef0a98ce66e8&with=93094f67-2012-43b6-8535-510b637a773d
 * @queryKey - of (required) : id of the primary user you whose connections you are looking for
 * @queryKey - with (option) : id of the secondary user (if you are looking for a connection between two users)
 * @returns - an array of connection object for a user or between two users
 */
router.get('/', (req: Request, res: Response) => {
    const connectionQueryObject: any = req.query;

    if (Object.keys(connectionQueryObject).length > 0 && connectionQueryObject.of) { // check if first user is passed

        const firstWriterId: string = connectionQueryObject.of;

        if (Object.keys(connectionQueryObject).length > 1 && connectionQueryObject.with) { // check if second user is passed
            const secondWriterId = connectionQueryObject.with;

            const connectionBetweenWriters = connections.find(connection => {
                return connection.sourceUserId === firstWriterId && connection.targetUserId === secondWriterId ||
                    connection.sourceUserId == secondWriterId && connection.targetUserId === firstWriterId;
            })

            if (connectionBetweenWriters) {
                return res.json([connectionBetweenWriters]); // the api will return an array of connections no matter if its a single connection object between two writers
            } else {
                return res.json([]);
            }
        } else {
            const writersConnections: Connection[] = connections.filter(connection => connection.sourceUserId === firstWriterId || connection.targetUserId === firstWriterId);
            res.json(writersConnections);
        }

    } else { // not providing any user information if no 'of' key-value pair is provided in the api call
        return res.status(400).json({ error: 'No \'of\' key-value pair is provided in the api call.' });
    }
})

router.get('/:connectionId', (req: Request, res: Response) => {
    res.status(200).json(req.body.connection);
})

// Route to create a connection object for two writers. Status is set to 'Pending' by default
router.post('/', (req: Request, res: Response) => {
    const connectionBody = req.body;

    try {
        validateConnection(connectionBody);
        const connection: Connection = createConnection(connectionBody);
        connections.push(connection);
        res.status(201).json(connection);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
})

// Route to update the 'status' of a connection
router.put('/:connectionId', (req: Request, res: Response) => {
    const connectionId = req.params.connectionId;
    const connectionToUpdate: Connection = req.body.connection;
    const updatedConnectionBody = req.body;

    try {
        if (!updatedConnectionBody.status) {
            return res.status(400).json('\'status\' is missing');
        }
        validateConnectionStatus(updatedConnectionBody.status);

        const newStatus: Status = getConnectionStatusFromString(updatedConnectionBody.status)!;
        const updatedConnection: Connection = updateConnectionStatus(connectionToUpdate, newStatus);
        updateById(connectionId, updatedConnection, connections);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
        return;
    }

    res.status(200).json(findById(connectionId, connections));
})

enum ConnectionsRouterErrors {
    ConnectionExists = 'Connection between the writers already exist',
    ConnectionNotFound = `Connection not found`,
}

export { router as connectionsRouter };