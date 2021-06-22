import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { round as mRound } from "mathjs";

import { Variable } from "./variable";

/**
 *
 * A set of utility functions.
 *
 */
/**
 *
 * Process a template in the form {{{placeholder}}}, filling it from a data
 * dictionary.
 *
 */
export function processTemplate(template: string, data: any): string {

  Object.keys(data).map((d: string) => {

    template = template.replace(`{{{${d}}}}`, data[d]);

  })

  return template;

}

/**
 *
 * Calculates the IDW of a set of points.
 *
 * @param data
 * The array of data at the points.
 * @param distances
 * The array of distance of the points.
 * @param power
 * The power the distance drops by.
 * @param round
 * The number of digits to round to.
 *
 */
export function idw(
  data: number[],
  distances: number[],
  power: number,
  round: number
): number {

  // To store the weigth for each point
  const weight: number[] = [];

  // To store the final interpolated result
  let h: number = 0;

  // The sum of the inverse of distances
  let sumInverseDistances: number = 0;

  // Calculate the sum of the inverse of the distance
  distances.map((x: any) =>
    sumInverseDistances += Math.pow(x, -power));

  // Calculate the weight of each point
  distances.map((x: any) =>
    weight.push(Math.pow(x, -power) / sumInverseDistances));

  // Calculate the final height
  for (let i = 0; i<data.length; i++) h += weight[i]*data[i];

  return mRound(h, round);

}

/**
 *
 * Creates an SQL to exports a serie of variables identified by their keys.
 *
 */
export function exportSql$(
  pg: RxPg,
  keys: string[],
  minZoom?: number,
  maxZoom?: number
): rx.Observable<string> {

  // Get variables
  return rx.zip(...keys.map((key: string) => Variable.getByKey$(pg, key)))
  .pipe(

    // Get variables' GridderTasks
    rxo.concatMap((o: Variable[]) =>
      rx.zip(...o.map((v: Variable) => v.getGridderTask$(pg)))),

    // Create the SQL
    rxo.map((o: Variable[]) => {

      // The final SQL
      let sql: string = 'with';

      // Construct final SQL, add all subqueries
      o.map((v: Variable) => {

        sql = `${sql} ${v.columnName} as (${v.getSql()}),`

      })

      // Add common cell fields
      sql = `${sql.slice(0, -1)} select t0.grid_id, t0.epsg, t0.zoom, t0.x, t0.y,`;

      // Add thematic values from variables
      o.map((v: Variable) => {

        sql = `${sql} ${v.columnName},`

      })

      // Add geom and the start of the from with the first two tables, being the
      // first the cell_data itself and the second the first subquery
      sql = `${sql} t0.geom from cell_data.data t0 left join ${o[0].columnName} t1 on t0.zoom=t1.zoom and t0.x=t1.x and t0.y=t1.y`;

      // Add the other subqueries to the from
      for(let t: number = 1; t<o.length; t++) {

        sql = `${sql} left join ${o[t].columnName} t${t+1} on t0.zoom=t${t+1}.zoom and t0.x=t${t+1}.x and t0.y=t${t+1}.y`;

      }

      // Where to eliminate all nulls
      sql = `${sql} where not(`

      o.map((v: Variable) => {

        sql = `${sql}${v.columnName} is null and `

      })

      // Add the final )
      sql = `${sql.slice(0, -5)})`

      // Check for minZoom and maxZoom
      // NOTE: the final "and" is technically wrong but this makes the slice
      // work seamlessly
      if (minZoom !== undefined && maxZoom !== undefined) {

        sql = `${sql} and t0.zoom between ${minZoom} and ${maxZoom}`;

      }

      // Clean up and order by
      sql = `${sql} order by t0.zoom, t0.x, t0.y;`

      return sql;

    })

  )

}
