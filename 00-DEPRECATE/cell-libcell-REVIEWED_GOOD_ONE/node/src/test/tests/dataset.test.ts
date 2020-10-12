import "mocha";

import { expect } from "chai";

import { DataSet, Catalog } from "../../lib/index";



describe("DataSets", function() {

    it("Tests DataSets", function() {

        const c: Catalog = new Catalog("c");

        c.build([

            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l",
            "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
            
        ]);

        const ds: DataSet = new DataSet(
            "NAME", "DESCRIPTION"
        );

        ds.addCatalog(c);


        expect(ds.name).to.equal("NAME");

        expect(ds.description).to.equal("DESCRIPTION");

        expect(ds.id.length).to.equal(64);

        expect(ds.catalogs[0].forward["a"]).to.equal("c");


        const ds_id: DataSet = new DataSet(
            "NAME", "DESCRIPTION", "ID"
        );

        expect(ds_id.name).to.equal("NAME");

        expect(ds_id.description).to.equal("DESCRIPTION");

        expect(ds_id.id).to.equal("ID");

    });

});
