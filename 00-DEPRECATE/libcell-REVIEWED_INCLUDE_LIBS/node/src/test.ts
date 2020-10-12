// function classDecorator<T extends {new(...args:any[]):{}}>(constructor: T) {

//     return class extends constructor {

//         hello = "override";

//         decomposeKey = 
//         (key: string): { type: string, id: string } => {

//             console.log("KK", T);

//             const split = key.split(":");

//             if (split.length !== 2) {
//                 throw Error(`Bad Redis key ${key}`);
//             } else {
//                 return { type: split[0], id: split[1] };
//             }

//         }

//         key = (): string => {

//             return "this.";

//         }

//     }

// }

interface IClassDecorator {

    type: string;

    persist: (a: any) => any;

}

// function classDecorator2(init: IClassDecorator) {

//     return function (constructor: Function) {

//         constructor.prototype.type = init.type;

//         constructor.prototype.persist = init.persist;


//     }

// }


function classDecorator(init: IClassDecorator){

    return function <T extends { new(...args: any[]): {} }>(constructor: T) {

        return class extends constructor {

            persist = init.persist;
            type = init.type;

            decomposeKey = 
            (key: string): { type: string, id: string } => {

                const split = key.split(":");

                if (split.length !== 2) {
                    throw Error(`Bad Redis key ${key}`);
                } else {
                    return { type: split[0], id: split[1] };
                }

            }

            key = (): string => {

                return this.id + this.type;

            }

        }

    }

}

interface ITest {

    elementa: string;
    elementb: string;

}

@classDecorator({
    type: "Greeter",
    persist: (a: Greeter): ITest => { return { elementa: a.property, elementb: a.hello } }
})
class Greeter {


    public property = "property";

    public hello: string;

    private _id: string;

    get id(): string {
        return this._id;
    }

    constructor(m: string, id: string) {

        this.hello = m;

        this._id = id;

    }

    // public persist(): any {

    //     console.log("PERSISTING!");

    // }

}

let a: Greeter = new Greeter("caca", "id222");

console.log(a.hello, a.id, a.property, a.type, a.decomposeKey("gh:ii"));

console.log("PERSIST :" , a.persist(a));

console.log("YYUYUY", a.jjuju);

console.log("D: yy", a.key());