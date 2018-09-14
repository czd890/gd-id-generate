nodejs 生成28位id，id包含数据：时间戳，机器ip，计数器，进程id

1. id长度为28位
2. id生成不重复，每秒可生成2亿个不重复id
3. 单台机器多进程部署支持
4. 多机器部署支持（ip不能相同）
5. 单台机器生成能保证顺序id生成，多机器时间一致能保证顺序id生成



npm install gd-id-generate --save

import { newId, resloveId } from "gd-id-generate";


var id = newId();

//output 5b9b60f32563259fc0a8017560cc

var rid = resloveId(id);

//output 
{timeStamp: 1536909555, counter: 627254687, ip: "192.168.1.117", pid: 24780}