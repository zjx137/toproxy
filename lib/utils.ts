import path from 'path'
import fs from 'fs'

export function getHeadersFromRawHeaders(rawHeaders: string[]):Object {
    const headerObj = {}
    if (rawHeaders) {
        for (let i = 0; i< rawHeaders.length; i+=2) {
            const key = rawHeaders[i]
            let val = rawHeaders[i+1]

            if (!headerObj[key]) {
                headerObj[key] = val
            }
        }
    }

    return headerObj
}

export function getUserHome() :string{
    return process.env.HOME || process.env.USERPROFILE
}

export function getToProxyHome(pathName : string) {
    const home = getUserHome()
    const targetPath = path.join(home, pathName)
    if(!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath)
    }
    return targetPath
}
