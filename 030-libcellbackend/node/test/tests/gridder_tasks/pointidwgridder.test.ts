import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  PointIdwGridderTask, gridderTaskGet$, Cell
} from "../../../src/index";

import {
  gridderTaskPointIdwMdt, pgConnCell, pgConnCellRawData,
  testCell, logger
} from "../common";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

/**
 *
 * PointIdwGridderTask pgInsert$.
 *
 */
describe("PointIdwGridderTask pgInsert$", function() {

  rxMochaTests({

    testCaseName: "PointIdwGridderTask pgInsert$",

    observables: [ gridderTaskPointIdwMdt.pgInsert$(pgConnCell) ],

    assertions: [

      (o: PointIdwGridderTask) => expect(o.name).to.be.equal("Interpolación MDT con IDW")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * PointIdwGridderTask get$.
 *
 */
describe("PointIdwGridderTask get$", function() {

  rxMochaTests({

    testCaseName: "PointIdwGridderTask get$",

    observables: [ gridderTaskGet$(pgConnCell, "gridderTaskPointIdwMdt") ],

    assertions: [

      (o: PointIdwGridderTask) => {

        expect(o.name).to.be.equal("Interpolación MDT con IDW");

      }

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * PointIdwGridderTask setup$.
 *
 */
describe("PointIdwGridderTask setup$", function() {

  rxMochaTests({

    testCaseName: "PointIdwGridderTask setup$",

    timeout: 200000,

    observables: [ gridderTaskPointIdwMdt.setup$(pgConnCellRawData, pgConnCell) ],

    assertions: [

      (o: PointIdwGridderTask) => expect(o.name).to.be.equal("Interpolación MDT con IDW")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * computeCell$.
 *
 */
describe("PointIdwGridderTask computeCell$", function() {

  rxMochaTests({

    testCaseName: "PointIdwGridderTask computeCell$",

    timeout: 300000,

    observables: [

      gridderTaskGet$(pgConnCell, "gridderTaskPointIdwMdt")
      .pipe(

        rxo.concatMap((o: PointIdwGridderTask) =>
          rx.zip(...testCell.map((x: Cell) =>
            o.computeCell$(
              pgConnCellRawData, pgConnCell, x, 9, logger))))

      )

    ],

    assertions: [

      (o: Cell[][]) => {

        expect(o.map((x: Cell[]) => x.length), "Child cells")
          .to.be.deep.equal([ 4, 4, 4, 0, 4, 25, 25, 0 ]);

      }

    ],

    verbose: false,

    active: true

  })

})
