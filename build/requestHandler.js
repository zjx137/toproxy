"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
function sendFinalResponse(res, resDetails) {
    res.writeHead(resDetails.statusCode, resDetails.header);
    res.end(resDetails.body);
    console.log('done');
}
function fetchRemoteResponse(protocol, reqData, options) {
    return new Promise((resolve, reject) => {
        console.log(options);
        const remoteRequest = (/https/i.test(protocol) ? https_1.default : http_1.default).request(options, (res) => {
            let resDataChunks = [];
            const statusCode = res.statusCode;
            const resHeader = res.headers;
            res.on('data', data => {
                // console.log('on data')
                resDataChunks.push(data);
            });
            res.on('end', () => {
                console.log(Buffer.concat(resDataChunks).toString());
                resolve({
                    statusCode,
                    header: resHeader,
                    body: Buffer.concat(resDataChunks),
                    rawBody: resDataChunks,
                    _res: res
                });
            });
            res.on('error', error => {
                reject(error);
            });
        });
        remoteRequest.end();
    });
}
function getReqHandler() {
    const ctx = this;
    return function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const host = req.headers.host;
            let reqData;
            let requestDetail;
            const protocol = (/^http:/).test(req.url) ? 'http' : 'https';
            const fullUrl = protocol === 'http' ? req.url : protocol + '://' + host + req.url;
            const urlPattern = new url_1.URL(fullUrl);
            const path = urlPattern.pathname;
            //console.log(req.rawHeaders)
            //console.log(getHeadersFromRawHeaders(req.rawHeaders))
            const fetchReqData = () => new Promise((resolve) => {
                const postData = [];
                req.on('data', data => {
                    postData.push(data);
                });
                req.on('end', () => {
                    reqData = Buffer.concat(postData);
                    resolve();
                });
            });
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
            };
            yield fetchReqData();
            prepareReqDetails();
            let resDetails = yield fetchRemoteResponse(protocol, reqData, requestDetail.requestOptions);
            // console.log(resDetails._res)
            sendFinalResponse(res, resDetails);
        });
    };
}
class RequestHandler {
    constructor(config) {
        this.reqHandler = getReqHandler.bind(this);
    }
}
exports.default = RequestHandler;
//# sourceMappingURL=requestHandler.js.map