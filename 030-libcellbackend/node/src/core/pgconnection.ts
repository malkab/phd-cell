import { PgOrm } from '@malkab/rxpg';

import { RxPg } from "@malkab/rxpg";

import { IMetadated } from '@malkab/libcell';

import * as rx from "rxjs";

/**
 *
 * A PG connection to connect to raw data.
 *
 */
export class PgConnection implements IMetadated, PgOrm.IPgOrm<PgConnection> {

  // Dummy PgOrm
  // TODO: implement pgDelete$ and pgUpdate$
  public pgDelete$: (pg: RxPg) => rx.Observable<PgConnection> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<PgConnection> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<PgConnection> = (pg) => rx.of();

  /**
   *
   * The connection.
   *
   */
  private _conn: RxPg | undefined;
  get conn(): RxPg | undefined { return this._conn }

  /**
   *
   * pgConnectionId.
   *
   */
  private _pgConnectionId: string;
  get pgConnectionId(): string { return this._pgConnectionId }

  /**
   *
   * applicationName.
   *
   */
  private _applicationName: string;
  get applicationName(): string { return this._applicationName }

  /**
   *
   * db.
   *
   */
  private _db: string;
  get db(): string { return this._db }
  set db(db: string) { this._db = db }

  /**
   *
   * host.
   *
   */
  private _host: string;
  get host(): string { return this._host }

  /**
   *
   * maxPoolSize.
   *
   */
  private _maxPoolSize: number;
  get maxPoolSize(): number { return this._maxPoolSize }

  /**
   *
   * minPoolSize.
   *
   */
  private _minPoolSize: number;

  get minPoolSize(): number { return this._minPoolSize }

  /**
   *
   * timeout.
   *
   */
  private _timeout: number;
  get timeout(): number { return this._timeout }

  /**
   *
   * pass.
   *
   */
  private _pass: string;
  get pass(): string { return this._pass }

  /**
   *
   * port.
   *
   */
  private _port: number;
  get port(): number { return this._port }

  /**
   *
   * DB user.
   *
   */
  private _dbUser: string;
  get dbUser(): string { return this._dbUser }

  /**
   *
   * Name.
   *
   */
  private _name: string;
  get name(): string { return this._name }

  /**
   *
   * Description.
   *
   */
  private _description: string;
  get description(): string { return this._description }

  /**
   *
   * Constructor.
   *
   */
  constructor({
      pgConnectionId,
      name,
      description,
      applicationName = "cell",
      db = "cell",
      host = "postgis",
      maxPoolSize = 200,
      minPoolSize = 50,
      timeout = 0,
      pass = "postgres",
      port = 5432,
      dbUser = "postgres"
    }: {
      pgConnectionId: string;
      name: string;
      description: string;
      applicationName?: string;
      db?: string;
      host?: string;
      maxPoolSize?: number;
      minPoolSize?: number;
      timeout?: number;
      pass?: string;
      port?: number;
      dbUser?: string;
  }) {

    this._name = name;
    this._description = description;
    this._pgConnectionId = pgConnectionId;
    this._applicationName = applicationName;
    this._db = db;
    this._host = host;
    this._maxPoolSize = maxPoolSize;
    this._minPoolSize = minPoolSize;
    this._timeout = timeout;
    this._pass = pass;
    this._port = port;
    this._dbUser = dbUser;
    this._conn = undefined;

    PgOrm.generateDefaultPgOrmMethods(this, {

        pgInsert$: {

          sql: () => `insert into cell_meta.pg_connection
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          params$: () => rx.of([ this.pgConnectionId, this.name, this.description,
            this.applicationName, this.db, this.host, this.maxPoolSize,
            this.minPoolSize, this.pass, this.port,
            this.dbUser ])

        }

      }

    );

  }

  /**
   *
   * Connect to the DB.
   *
   */
  public open(): RxPg {

    this._conn = new RxPg({
      applicationName: this._applicationName,
      db: this._db,
      host: this._host,
      maxPoolSize: this._maxPoolSize,
      minPoolSize: this._minPoolSize,
      idleTimeoutMillis: this._timeout,
      pass: this._pass,
      port: this._port,
      user: this._dbUser
    })

    return this._conn;

  }

  /**
   *
   * Close.
   *
   */
  public close(): boolean {

    this._conn?.close$().subscribe();
    this._conn = undefined;
    return true;

  }

  /**
   *
   * Get$.
   *
   */
  public static get$(pg: RxPg, pgConnectionId: string): rx.Observable<PgConnection> {

    return PgOrm.select$<PgConnection>({
      pg: pg,
      sql: `
        select
          pg_connection_id as "pgConnectionId",
          application_name as "applicationName",
          db,
          host,
          max_pool_size as "maxPoolSize",
          min_pool_size as "minPoolSize",
          pass,
          port,
          db_user as "dbUser",
          name,
          description
        from cell_meta.pg_connection
        where pg_connection_id = $1`,
      params: () => [ pgConnectionId ],
      type: PgConnection
    })

  }

}
