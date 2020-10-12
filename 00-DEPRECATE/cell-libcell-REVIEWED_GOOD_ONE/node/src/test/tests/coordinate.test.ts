import "mocha";

import { expect } from "chai";

import { Coordinate } from "../../lib/index";



describe("Coordinate tests", function() {

    it("Tests coordinates", function() {

        const c: Coordinate = new Coordinate("3035", 10, 10);

        expect(c.epsg).to.equal("3035");

        expect(c.x).to.equal(10);

        expect(c.y).to.equal(10);

    });

});
