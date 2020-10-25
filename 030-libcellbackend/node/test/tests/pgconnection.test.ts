import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { PgConnection } from "../../src/index";

import { cellPg, cellRawDataConn } from "./common";

import * as rxo from "rxjs/operators";

/**
 *
 * Test PgConnection.
 *
 */
describe("PgConnection", function() {

  /**
   *
   * Connection DB insert.
   *
   */
  rxMochaTests({

    testCaseName: "ORM pgInsert$",

    observable: cellRawDataConn.pgInsert$(cellPg),

    assertions: [
      (o: PgConnection) => expect(o.name).to.be.equal("Cell Raw Data") ],

    verbose: false

  }),

  /**
   *
   * Connection DB get.
   *
   */
  rxMochaTests({

    testCaseName: "ORM get$",

    observable: PgConnection.get$(cellPg, cellRawDataConn.pgConnectionId),

    assertions: [
      (o: PgConnection) => expect(o.name).to.be.equal(cellRawDataConn.name) ],

    verbose: false

  }),

  /**
   *
   * Connection DB open().
   *
   */
  rxMochaTests({

    testCaseName: "open()",

    observable: PgConnection.get$(cellPg, cellRawDataConn.pgConnectionId)
      .pipe(

        rxo.concatMap((o: PgConnection) => o.open())

      ),

    assertions: [
      (o: PgConnection) => expect(o.name).to.be.equal(cellRawDataConn.name) ]

  }),

  /**
   *
   * Conenection DB open() fail.
   *
   */
  rxMochaTests({

    testCaseName: "open() fail",

    observable: PgConnection.get$(cellPg, cellRawDataConn.pgConnectionId)
      .pipe(

        rxo.concatMap((o: PgConnection) => {

          o.db = "postgres";
          expect(o.db).to.be.equal("postgres");
          return o.open()

        })

      ),

    assertions: [
      (o: Error) =>
        expect(o.message).to.be.equal("DB postgres not a PostGIS DB") ]

  })

})
