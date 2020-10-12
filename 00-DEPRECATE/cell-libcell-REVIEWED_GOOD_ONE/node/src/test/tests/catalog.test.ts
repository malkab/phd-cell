import "mocha";

import { expect } from "chai";

import { Catalog } from "../../lib/index";



describe("Catalogs", function() {

    it("Tests catalogs", function() {

        const c: Catalog = new Catalog("c");

        c.build([

            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l",
            "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
            
        ]);

        expect(c.backward)
        .to.deep.equal({

            "0": "s", "1": "d", "2": "c", "3": "b", "4": "r", "5": "w", 
            "6": "m", "8": "k", "14": "p", "18": "j", "25": "f", 
            "59": "z", "65": "o", "c": "a", "3f": "e", "cd": "g", "a": "h", 
            "d": "i", "ac": "l", "1b": "n", "8e": "q", "e": "t", "0b": "u", 
            "4c": "v", "2d": "x", "a1": "y"
        
        });

        expect(c.forward)
        .to.deep.equal({

            a: "c", b: "3", c: "2", d: "1", e: "3f", 
            f: "25", g: "cd", h: "a", i: "d", j: "18", 
            k: "8", l: "ac", m: "6", n: "1b", o: "65", 
            p: "14", q: "8e", r: "4", s: "0", t: "e", 
            u: "0b", v: "4c", w: "5", x: "2d", y: "a1", 
            z: "59"
        
        });

    });

});
