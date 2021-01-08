import * as turf from "@turf/turf";

/**
 *
 * This class represents a polygon.
 *
 */
export class Polygon {

  /**
   *
   * This is the underlying Turf geometry
   *
   */
  private _turfPolygon: any;

  /**
   *
   * Returns the area, as calculated by Turf.
   *
   */
  get area(): number {

    return turf.area(this._turfPolygon);

  }

  /**
   *
   * The underlying Turf geometry.
   *
   */
  get turfPolygon(): any {

    return this._turfPolygon;

  }

  /**
   *
   * Constructor
   *
   * @param turfPolygon      The turfPolygon to initialize this
   *                         polygon with, if any.
   *
   */
  constructor(turfPolygon?: any) {

    this._turfPolygon = turfPolygon;

  }

  /**
   *
   * Initializes the polygon from a GeoJSON in 4326. Must be complete.
   *
   * @param geojson
   *
   */
  public fromGeoJson(geojson: any): any {

    this._turfPolygon = turf.polygon(geojson.geometry.coordinates);

    return this;

  }

  /**
   *
   * Intersects this polygon with another one and returns the result.
   *
   * @param polygon       The polygon to intersect with.
   *
   */
  public intersection(polygon: Polygon): Polygon {

    return new Polygon(turf.intersect(this._turfPolygon, polygon.turfPolygon));

  }

}
