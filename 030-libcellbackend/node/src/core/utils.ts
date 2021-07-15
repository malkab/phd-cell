import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { round as mRound } from "mathjs";

import { Variable } from "./variable";

import { sha256 } from "@malkab/node-utils";

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
 * @param pg
 * PostgreSQL connection to target Cell database.
 * @param mvName
 * Name to be given to the final materialized view.
 * @param keys
 * The array of Variable keys to include in the export materialized view.
 * @param __namedParameters
 * Optional parameters.
 * @param schema
 * Schema for the final MV. Defaults to "public".
 * @param pgSqlDataTypes
 * An array to supersede default GridderTask PG SQL data types to enforce on the
 * variable's data. The dimension of this array must match that of param "keys".
 * @param minZoom
 * Min cell zoom to export. Must be lower than "maxZoom".
 * @param maxZoom
 * Max cell zoom to export. Must be higher than "minZoom".
 * @param addNullityFields
 * Variable keys to add to the full null condition that will wipe cells that has
 * all given keys to null. This is processed after "excludeNullityFields".
 * @param excludeNullityFields
 * Variable keys to exclude from the full null condition that will wipe cells
 * that has all given keys to null. This is processed before "addNullityFields".
 *
 */
export function exportSql$(
  pg: RxPg,
  mvName: string,
  keys: string[],
  {
    schema = "public",
    pgSqlDataTypes,
    minZoom,
    maxZoom,
    addNullityFields,
    excludeNullityFields
  }: {
    schema?: string;
    pgSqlDataTypes?: string[];
    minZoom?: number;
    maxZoom?: number;
    addNullityFields?: string[];
    excludeNullityFields?: string[];
  } = {}
): rx.Observable<string> {

  // Check that if pgSqlDataTypes exists has the same dimension than keys
  if (pgSqlDataTypes !== undefined) {

    if (pgSqlDataTypes.length !== keys.length) {

      throw new Error("keys and optional parameter pgSqlDataTypes must have the same dimension");

    }

  }

  // Get variables
  return rx.zip(...keys.map((key: string) => Variable.getByKey$(pg, key)))
  .pipe(

    // Get variables' GridderTasks
    rxo.concatMap((o: Variable[]) =>
      rx.zip(...o.map((v: Variable) => v.getGridderTask$(pg)))),

    // Create the SQL
    rxo.map((o: Variable[]) => {

      // The final SQL
      let sql: string = '';

      // This array is to store the hashed names of the subqueries
      const mvNames: string[] = [];

      // A counter to cycle the pgSqlDataTypes array if present
      let typeIdx: number = 0;

      // Construct final SQL, add all subqueries
      o.map((v: Variable) => {

        // Generate a hash name for the variable MV, coupled with the schema
        const subMvName: string = `mv__${sha256(v.name, true)}`;

        // Store the MV name
        mvNames.push(`${schema}.${subMvName}`);

        // Add SQL to final SQL, checking if the pgSqlDataTypes array is
        // defined
        if (pgSqlDataTypes !== undefined) {

          sql = `${sql} ${v.getSql(subMvName, {
              schema: schema,
              minZoom: minZoom,
              maxZoom: maxZoom,
              pgSqlDataType: pgSqlDataTypes[typeIdx]
            })}`;

        } else {

          sql = `${sql} ${v.getSql(subMvName, {
              schema: schema,
              minZoom: minZoom,
              maxZoom: maxZoom
            })}`;

        }

        typeIdx += 1;

      })

      // Add common cell fields
      sql = `${sql} create materialized view ${schema}.${mvName} as select t0.grid_id as grid_id, t0.epsg as epsg, t0.zoom as zoom, t0.x as x, t0.y as y,`;

      // Add thematic values from variables
      o.map((v: Variable) => {

        sql = `${sql}${v.columnName},`

      })

      // Add geom and the start of the from with the first two tables, being the
      // first the cell_data itself and the second the first subquery
      sql = `${sql} t0.geom from cell_data.data t0 left join ${mvNames[0]} t1 on t0.zoom=t1.zoom and t0.x=t1.x and t0.y=t1.y`;

      // Add the other subqueries to the from
      for(let t: number = 1; t<o.length; t++) {

        sql = `${sql} left join ${mvNames[t]} t${t+1} on t0.zoom=t${t+1}.zoom and t0.x=t${t+1}.x and t0.y=t${t+1}.y`;

      }

      // Process the full nullity condition. By default, all variables are
      // included in the condition, unless the addNullityFields or
      // excludeNullityFields options are used.
      let nullityFields: Variable[] = o;

      // Process excludeNullityFields if exists
      if (excludeNullityFields !== undefined) {

        nullityFields = o.filter((v: Variable) =>
          excludeNullityFields.findIndex(
            (key: string) => key === v.variableKey) === -1

          );

      }

      // Process addNullityFields if exists
      if (addNullityFields !== undefined) {

        nullityFields = nullityFields.filter((v: Variable) =>
          addNullityFields.findIndex(
            (key: string) => key === v.variableKey) > -1

          );

      }

      // Where to eliminate all nulls. If nullityFields has been specified, only
      // those fields will create the full null condition, otherwise, all fields
      // will be taken into count.
      sql = `${sql} where not(`

      nullityFields.map((v: Variable) => {

        sql = `${sql}${v.columnName} is null and `

      })

      // Add the final )
      sql = `${sql.slice(0, -5)})`

      // Check for minZoom and maxZoom
      if (minZoom !== undefined && maxZoom !== undefined) {

        sql = `${sql} and t0.zoom between ${minZoom} and ${maxZoom}`;

      }

      // Clean up and order by
      sql = `${sql} order by t0.zoom, t0.x, t0.y;`

      // Add the final index
      sql = `${sql} create index ${mvName}_idx on ${schema}.${mvName} using btree(grid_id, epsg, zoom, x, y);`;

      // Drop the first space
      return sql.slice(1);

    })

  )

}
