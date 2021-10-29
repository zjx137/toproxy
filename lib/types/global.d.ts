declare class RequestHandler {
    constructor(config: object)
    RequestHandler(): Function
}

interface RequestDetail {
    requestOptions: object,
    protocol: string,
    url: string,
    requestData: Buffer,
    _req: any
}

interface ResponseDetails {
    statusCode: number,
    header: import('http').IncomingHttpHeaders,
    body: Buffer,
    rawBody: Buffer [],
    _res: import('http').IncomingMessage
}
