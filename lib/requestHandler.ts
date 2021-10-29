import { URL } from 'url'
import http from 'http'
import https from 'https'
import { getHeadersFromRawHeaders } from './utils'

function sendFinalResponse(res: http.ServerResponse, resDetails: ResponseDetails) {
    res.writeHead(resDetails.statusCode, resDetails.header)
    res.end(resDetails.body)
    console.log('done')
}

function fetchRemoteResponse(protocol:string ,reqData: Buffer, options: any):Promise<ResponseDetails> {
    return new Promise((resolve, reject) => {
        console.log(options)
        const remoteRequest = (/https/i.test(protocol) ? https : http).request(options, (res) => {
            let resDataChunks: Buffer[] = []
            const statusCode = res.statusCode
            const resHeader = res.headers
            res.on('data', data => {
                // console.log('on data')
                resDataChunks.push(data)
            })
            res.on('end', () => {
                console.log(Buffer.concat(resDataChunks).toString())
                
                resolve({
                    statusCode,
                    header: resHeader,
                    body: Buffer.concat(resDataChunks),
                    rawBody: resDataChunks,
                    _res: res
                })
            })
            res.on('error', error => {
                reject(error)
            })
        })
        remoteRequest.end()
    })

}

function getReqHandler(): Function {
    const ctx = this
    return async function (req: http.IncomingMessage, res: http.ServerResponse) {
        const host = req.headers.host
        let reqData: Buffer
        let requestDetail: RequestDetail
        const protocol = (/^http:/).test(req.url) ? 'http' : 'https'
        
        const fullUrl = protocol === 'http' ? req.url : protocol + '://' + host +  req.url

        const urlPattern = new URL(fullUrl)
        const path = urlPattern.pathname
        //console.log(req.rawHeaders)
        //console.log(getHeadersFromRawHeaders(req.rawHeaders))

        const fetchReqData = () => new Promise<void>((resolve) => {
            const postData = []
            req.on('data', data => {
                postData.push(data)
            })
            req.on('end', () => {
                reqData = Buffer.concat(postData)
                resolve()
            })
        })

        const prepareReqDetails = () => {
            const options = {
                hostname: urlPattern.hostname || req.headers.host,
                port: urlPattern.port || (/https/.test(protocol) ? 443 : 80),
                path,
                method: req.method,
                headers: req.headers
              };
        
              requestDetail = {
                requestOptions: options,
                protocol,
                url: fullUrl,
                requestData: reqData,
                _req: req
              };

        }


        await fetchReqData()
        prepareReqDetails()
        let resDetails = await fetchRemoteResponse(protocol, reqData, requestDetail.requestOptions)
        // console.log(resDetails._res)
        sendFinalResponse(res, resDetails)
        
    }
}



class RequestHandler {
    reqHandler: Function
    constructor(config) {
        this.reqHandler = getReqHandler.bind(this)
    }
    
    
}

export default RequestHandler
