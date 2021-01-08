import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  PointIdwGridderTask, gridderTaskGet$, Cell, MdtProcessingGridderTask
} from "../../../src/index";

import {
  gridderTaskPointIdwMdt, pgConnCell, pgConnCellRawData,
  testCell, logger, gridderTaskMdtProcessing
} from "../common";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

/**
 *
 * MdtProcessingGridderTask pgInsert$.
 *
 */
describe("MdtProcessingGridderTask pgInsert$", function() {

  rxMochaTests({

    testCaseName: "MdtProcessingGridderTask pgInsert$",

    observables: [ gridderTaskMdtProcessing.pgInsert$(pgConnCell) ],

    assertions: [

      (o: MdtProcessingGridderTask) =>
        expect(o.name)
          .to.be.equal("Interpolación MDT por media de alturas e IDW")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * MdtProcessingGridderTask get$.
 *
 */
describe("MdtProcessingGridderTask get$", function() {

  rxMochaTests({

    testCaseName: "MdtProcessingGridderTask get$",

    observables: [ gridderTaskGet$(pgConnCell, "gridderTaskMdtProcessing") ],

    assertions: [

      (o: PointIdwGridderTask) => {

        expect(o.name).to.be.equal("Interpolación MDT por media de alturas e IDW");

      }

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * MdtProcessingGridderTask setup$.
 *
 */
describe("MdtProcessingGridderTask setup$", function() {

  rxMochaTests({

    testCaseName: "MdtProcessingGridderTask setup$",

    observables: [ gridderTaskMdtProcessing.setup$(pgConnCellRawData, pgConnCell) ],

    assertions: [

      (o: MdtProcessingGridderTask) =>
        expect(o.name).to.be.equal("Interpolación MDT por media de alturas e IDW")

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
describe("MdtProcessingGridderTask computeCell$", function() {

  rxMochaTests({

    testCaseName: "MdtProcessingGridderTask computeCell$",

    timeout: 300000,

    observables: [

      gridderTaskGet$(pgConnCell, "gridderTaskMdtProcessing")
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
          .to.be.deep.equal([ 4, 4, 4, 4, 4, 25, 25, 0 ]);

      }

    ],

    verbose: false,

    active: true

  })

})
