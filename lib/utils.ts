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