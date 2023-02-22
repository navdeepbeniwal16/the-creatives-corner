import { v4 as uuidv4 } from 'uuid';

export interface Connection {
    id: string,
    dateCreated: Date,
    sourceUserId: string,
    targetUserId: string,
    status: Status
}

export enum Status {
    Pending = 'Pending',
    Accepted = 'Accepted',
    Blocked = 'Blocked',
    Canceled = 'Canceled'
}

export const validateConnection = (connectionBody: any): boolean => {
    if (!connectionBody.hasOwnProperty('sourceUserId')) {
        throw new Error('\'sourceUserId\' is missing');
    }

    if (!connectionBody.hasOwnProperty('targetUserId')) {
        throw new Error('\'targetUserId\' is missing');
    }

    if (connectionBody.hasOwnProperty('status') && validateStatus(connectionBody.status)) {
        throw new Error('Invalid \'status\' value');
    }

    return true;
}

export const validateStatus = (connectionString: string): boolean => {
    if (
        connectionString !== Status.Accepted &&
        connectionString !== Status.Blocked &&
        connectionString !== Status.Canceled &&
        connectionString !== Status.Pending
    ) {
        throw new Error('Invalid \'status\' value');
    }

    return true;
}

export const createConnection = (connectionBody: any): Connection => {
    const connection: Connection = {
        id: uuidv4(),
        dateCreated: new Date(),
        sourceUserId: connectionBody.sourceUserId,
        targetUserId: connectionBody.targetUserId,
        status: Status.Pending
    }

    return connection;
}

export const updateConnectionStatus = (connection: Connection, status: Status): Connection => {
    connection.status = status;
    return connection;
}

export const getStatusFromString = (statusString: string): Status | undefined => {
    switch (statusString) {
        case 'Pending':
            return Status.Pending;
        case 'Accepted':
            return Status.Accepted;
        case 'Blocked':
            return Status.Blocked;
        case 'Canceled':
            return Status.Canceled;
        default:
            return undefined;
    }
}