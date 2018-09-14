function intToByteArray(n) {
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

function ensureByteSize(str) {

    while (str.length != 8)
        str = "0" + str;

    return str;
}

function toStringArray(arr) {

    var result = [];

    for (var i = arr.length - 1; i >= 0; i--) {

        var binary = arr[i].toString(2);
        var toAdd = ensureByteSize(binary);
        result.push(toAdd);
    }

    return result;
}

function bytesToInt(bytes) {
    bytes = bytes.reverse()
    var n = 0;
    for (let index = 0; index < bytes.length; index++) {
        var nx = n << 8;
        var bx = bytes[index] & 0xff;
        var cx = nx | bx;
        console.log(`处理byte:${bytes[index]}\t\t\t\tn:${n}\t\t\t\tn<<8:${nx}\t\t\t\tb&255:${bx}\t\t\t\tn|b:${cx}`)
        n = n << 8 | (bytes[index] & 0xff)
    }
    return n
}

function format(n) {
    var nb = intToByteArray(n);
    var ns = toStringArray(nb).join('-');
    var nr = nb.concat().reverse()
        // var nn = bytesToInt(nb);
    console.log(n, nr, ns, nb, nb === nr)
}
format(27704)
console.log('------------------------------')
format(16777215 + 100)


/**
 *  [ 121, 65, 151, 91 ] '01011011-10010111-01000001-01111001'
    [ 122, 65, 151, 91 ] '01011011-10010111-01000001-01111010'
    [ 123, 65, 151, 91 ] '01011011-10010111-01000001-01111011'
 */