import http from "http";

declare global {
    class RequestHandler {
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
    

}

export {}