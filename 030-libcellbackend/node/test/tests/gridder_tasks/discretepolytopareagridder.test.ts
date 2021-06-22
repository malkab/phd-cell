import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  DiscretePolyTopAreaGridderTask, gridderTaskGet$, Cell
} from "../../../src/index";

import {
  gridderTaskDiscretePolyTopAreaMunicipio, pgConnCell, pgConnCellRawData,
  testCell, logger
} from "../common";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

/**
 *
 * DiscretePolyTopAreaGridderTask pgInsert$.
 *
 */
describe("DiscretePolyTopAreaGridderTask pgInsert$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyTopAreaGridderTask pgInsert$",

    observables: [ gridderTaskDiscretePolyTopAreaMunicipio.pgInsert$(pgConnCell) ],

    assertions: [

      (o: DiscretePolyTopAreaGridderTask) => expect(o.name).to.be.equal("Municipio máxima área")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * DiscretePolyTopAreaGridderTask get$.
 *
 */
describe("DiscretePolyTopAreaGridderTask get$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyTopAreaGridderTask get$",

    observables: [ gridderTaskGet$(pgConnCell, "gridderTaskDiscretePolyTopAreaMunicipio") ],

    assertions: [

      (o: DiscretePolyTopAreaGridderTask) => {

        expect(o.name).to.be.equal("Municipio máxima área");

      }

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * Setup the GridderTask.
 *
 */
describe("DiscretePolyTopAreaGridderTask setup$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyTopAreaGridderTask setup$",

    observables: [ gridderTaskDiscretePolyTopAreaMunicipio.setup$(pgConnCellRawData, pgConnCell) ],

    assertions: [

      (o: DiscretePolyTopAreaGridderTask) => expect(o.name).to.be.equal("Municipio máxima área")

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
describe("DiscretePolyTopAreaGridderTask computeCell$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyTopAreaGridderTask computeCell$",

    timeout: 300000,

    observables: [

      gridderTaskGet$(pgConnCell, "gridderTaskDiscretePolyTopAreaMunicipio")
      .pipe(

        rxo.concatMap((o: DiscretePolyTopAreaGridderTask) => {

          return rx.zip(...testCell.map((x: Cell) =>
            o.computeCell$(
              pgConnCellRawData, pgConnCell, x, 5, logger)))

        })

      )

    ],

    assertions: [

      (o: Cell[][]) => {

        expect(o.map((x: Cell[]) => x.length), "Child cells")
          .to.be.deep.equal([ 0, 4, 4, 0, 4, 0, 0, 0 ]);

      }

    ],

    verbose: false,

    active: true

  })

})