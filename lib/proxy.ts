import http from 'http'
import https from 'https'
import net from 'net'
import events from 'events'
import async from 'async'
import co from 'co'
import RequestHandler from './requestHandler'

const T_TYPE_HTTP = 'http',
    T_TYPE_HTTPS = 'https',
    DEFAULT_TYE = T_TYPE_HTTP

const PROXY_STATUS_INIT = 'INIT',
    PROXY_STATUS_READY = 'ready',
    PROXY_STATUS_CLOSED = 'closed'

class ProxyCore extends events.EventEmitter {
    proxyType: string
    httpProxyServer: http.Server | null
    requestHandler: RequestHandler
    coreStatus: string
    proxyPort: number
    socketIndex: number
    constructor(config) { // tsfix config
        super()
        config = config || {}
        this.proxyType = /https/i.test(config.type || DEFAULT_TYE) ? T_TYPE_HTTPS : T_TYPE_HTTP
        this.proxyPort = config.proxyPort || 1080
        this.coreStatus = PROXY_STATUS_INIT

        this.httpProxyServer = null
        this.requestHandler = null

        this.requestHandler = new RequestHandler({})
    }

    start() {
        const self = this
        self.socketIndex = 0

        if(self.coreStatus !== PROXY_STATUS_INIT) {
            throw new Error('proxy status is not INIT')
        }

        async.series(
            [
                // create proxy server
                function (callback) {
                    if (self.proxyType === T_TYPE_HTTPS) {
                        // handle https server
                        self.httpProxyServer = http.createServer(self.requestHandler.reqHandler())
                    } else {
                        self.httpProxyServer = http.createServer(self.requestHandler.reqHandler())
                    }
                    callback(null)
                },

                // start proxy server
                function (callback) {
                    self.httpProxyServer.listen(self.proxyPort)
                    console.log('listen 127.0.0.1:1080')
                    callback(null)
                }
            ],
            (err, res) => {
                if(!err) {
                    // handle log

                    self.coreStatus = PROXY_STATUS_READY
                    self.emit('ready')
                    
                }
            }
        )

        return self
    }

    close() {

        return new Promise((resolve) => {
            if(this.httpProxyServer) {

                this.httpProxyServer.close((err) => {
                    if(err) {

                    } else {
                        this.httpProxyServer = null
                        this.coreStatus = PROXY_STATUS_CLOSED
                    }
                    resolve(err)
                })
            } else {
                resolve(null)
            }
        })
    }
}

let test = new ProxyCore({})
test.start()
