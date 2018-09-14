import os from 'os'


function getLocalIp() {
    var nif = os.networkInterfaces();
    for (const key in nif) {
        if (nif.hasOwnProperty(key)) {
            const element = nif[key];
            for (let index = 0; index < element.length; index++) {
                const item = element[index];
                if (item.family === 'IPv4' && item.address !== '127.0.0.1') {
                    return item.address;
                }

            }
        }
    }
    return "";
}
let _cache_local_bypte_ip: number[] = []
function getLocalIpByte() {
    if (_cache_local_bypte_ip.length != 0)
        return _cache_local_bypte_ip;
    _cache_local_bypte_ip = [127, 0, 0, 1];
    var ip = getLocalIp();
    var arr = ip.split('.');
    if (arr.length === 4) {
        try {
            var tempArr = [parseInt(arr[0]), parseInt(arr[1]), parseInt(arr[2]), parseInt(arr[3])]
            _cache_local_bypte_ip = tempArr;
        } catch (error) {
            console.error("ip to byte[] error", error);
        }
    }
    return _cache_local_bypte_ip;
}
function getTimeStamp() {
    return Math.round(new Date().getTime() / 1000)
}
function rnd(min: number, max: number) {
    var random = Math.floor(Math.random() * (max - min + 1) + min);
    return random;
}
let _last_sec = 0;
let _counter = 0;
const int32_maxvalue = 2147483647;//16777215;[255,255,255]
function getCounter(current_sec: number) {
    current_sec = Math.floor(current_sec);
    if (current_sec > _last_sec) {
        _counter = rnd(0, int32_maxvalue)
    }
    if (_counter === int32_maxvalue)
        _counter = 0;

    _last_sec = current_sec;
    _counter += 1;
    return _counter;

}
function getPid() {
    return process.pid;

}
function intToByteArray(n: number) {
    var result = [0, 0, 0, 0];
    var mask = 255;
    var i = 0;
    while (n > 0) {
        result[i] = n & mask;
        i++;
        n >>= 8;
    }
    return result
}

function bytesToInt(bytes: number[]) {
    bytes = bytes.reverse();
    var n = 0;
    for (let index = 0; index < bytes.length; index++) {
        n = n << 8 | (bytes[index] & 0xff)
    }
    return n
}

function bytes2HexString(bytes: Buffer) {
    let hexs = "";

    for (let i = 0; i < bytes.length; i++) {
        let hex = bytes[i].toString(16);
        if (hex.length == 1) {
            hex = '0' + hex;
        }
        hexs += hex.toLowerCase();
    }
    return hexs;
}

function hexstring2btye(str: string) {
    let pos = 0;
    let len = str.length;
    if (len % 2 != 0) {
        return null;
    }
    len /= 2;
    let hexA = new Array<number>();
    for (let i = 0; i < len; i++) {
        let s = str.substr(pos, 2);
        let v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
    }
    return hexA;
}
export function newId() {
    //4字节时间|4字节自增|4字节ip|2字节pid
    var b = new Buffer(14);
    var time = getTimeStamp();
    var timeStampByteArray = intToByteArray(time);
    var counter = getCounter(Date.now() / 1000);
    var counterByteArray = intToByteArray(counter);
    var ipByteArray = getLocalIpByte();
    var pidByteArray = intToByteArray(getPid());
    // console.info(time, counter, getLocalIp(), getPid())
    b[0] = timeStampByteArray[3];
    b[1] = timeStampByteArray[2];
    b[2] = timeStampByteArray[1];
    b[3] = timeStampByteArray[0];

    b[4] = counterByteArray[3];
    b[5] = counterByteArray[2];
    b[6] = counterByteArray[3];
    b[7] = counterByteArray[0];

    b[8] = ipByteArray[0];
    b[9] = ipByteArray[1];
    b[10] = ipByteArray[2];
    b[11] = ipByteArray[3];

    b[12] = pidByteArray[1];
    b[13] = pidByteArray[0];
    return bytes2HexString(b);

}
export interface ObjectId {
    timeStamp: number,
    counter: number,
    ip: string,
    pid: number
}
export function resloveId(id: string): ObjectId {
    var b = hexstring2btye(id);
    if (!b) throw Error(`${id} is not a legal one `)
    return {
        timeStamp: bytesToInt([b[3], b[2], b[1], b[0]]),
        counter: bytesToInt([b[7], b[6], b[5], b[4]]),
        ip: `${b[8]}.${b[9]}.${b[10]}.${b[11]}`,
        pid: bytesToInt([b[13], b[12], 0, 0])
    }
}