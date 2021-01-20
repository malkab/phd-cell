import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  DiscretePolyTopAreaGridderTask, gridderTaskGet$,
} from "../../../src/index";

import {
  gridderTaskDiscretePolyTopAreaMunicipio, pgConnCell, pgConnCellRawData,
  testCell, logger
} from "../common";

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
 * Run batch.
 *
 */
describe("DiscretePolyTopAreaGridderTask computeCellsBatch$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyTopAreaGridderTask computeCellsBatch$",

    timeout: 300000,

    observables: [

      gridderTaskGet$(pgConnCell, "gridderTaskDiscretePolyTopAreaMunicipio")
      .pipe(

        rxo.concatMap((o: DiscretePolyTopAreaGridderTask) => {

          return o.computeCellsBatch$(
            pgConnCellRawData, pgConnCell, testCell, 5, logger)

        })


      )

    ],

    assertions: [],

    verbose: false,

    active: true

  })

})
