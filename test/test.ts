import { newId, resloveId } from "../src";
console.log('begin')
for (let index = 0; index < 100; index++) {
    var id = newId();
    var rid = resloveId(id);
    console.log(id, rid)

}