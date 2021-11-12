import EasyCert from 'node-easy-cert'
import os from 'os'
import { getToProxyHome } from './utils'

const options = {
    rootDirPath: getToProxyHome('certificates'),
    inMemory: false,
    defaultCertAttrs: [
        { name: 'countryName', value: 'CN' },
        { name: 'organizationName', value: 'ToProxy' },
        { shortName: 'ST', value: 'SH' },
        { shortName: 'OU', value: 'ToProxy SSL Proxy' }
    ]
}

const easyCert = new EasyCert(options)
