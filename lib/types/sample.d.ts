declare var aa:string
interface Ob {
    sb:string
}
interface ResponseDetails {
    statusCode: number,
    header: import('http').IncomingHttpHeaders,
    body: Buffer,
    rawBody: Buffer [],
    _res: import('http').IncomingMessage
}