import { round as mRound } from "mathjs";

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
