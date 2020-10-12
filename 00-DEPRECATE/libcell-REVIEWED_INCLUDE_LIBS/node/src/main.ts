// Just a placeholder

console.log("main");

// import { PgConnection, IPgConnection }
//     from "../package-DEPRECATGE/REWORK-DEPRECATE/pgconnection";

import { CellObject }
    from "./libcell/cellobject";


/*

    Persistence tests

*/

import { Keeper, KeeperMemoryService }
    from "@malkab/keeper-core";

const k: Keeper = new Keeper();

k.registerClass([ CellObject ]);

const m: KeeperMemoryService = new KeeperMemoryService();

k.registerService("mem", m);

k.registerPersistenceChain([ "mem" ]);

console.log("D: chains", k.services);

const co: CellObject = new CellObject("co", "thename", "thedescription",
    "thelongdescription");

// const pgConn: PgConnection = new PgConnection("testpgconn",
//     <IPgConnection>{
//         db: "db",
//         description: "The description",
//         host: "host",
//         longdescription: "The long description",
//         name: "The name",
//         pass: "pass",
//         port: 5432,
//         user: "user"
//     }
// );

k.set(co)
.then((res) => {

    console.log("Set: ", res);

    return k.keys();

})

.then((res) => {

    console.log("Keys: ", res);

    console.log("Dd: ", m._objects);

    return k.get("CellObject:co");

})

.then((res) => {

    console.log("Get: ", res);

})

.catch((error) => {

    console.log("Error: ", error);

})