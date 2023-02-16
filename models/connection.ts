export interface Connection {
    dateCreated: Date,
    sourceUserId: number,
    targetUserId: number,
    status: Status
}

enum Status {
    Pending,
    Accepted,
    Rejected,
    Blocked,
    Canceled
}
