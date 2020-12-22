import { PgOrm } from '@malkab/rxpg';

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

/**
 *
 * A PG connection to connect to raw data.
 *
 */
export class SourcePgConnection implements PgOrm.IPgOrm<SourcePgConnection> {

  // Dummy PgOrm
  // TODO: implement pgDelete$ and pgUpdate$
  public pgDelete$: (pg: RxPg) => rx.Observable<SourcePgConnection> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<SourcePgConnection> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<SourcePgConnection> = (pg) => rx.of();

  /**
   *
   * sourcePgConnectionId.
   *
   */
  private _sourcePgConnectionId: string;
  get sourcePgConnectionId(): string { return this._sourcePgConnectionId }

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
      sourcePgConnectionId,
      name,
      description,
      applicationName = "cell",
      db = "cell",
      host = "postgis",
      maxPoolSize = 10,
      minPoolSize = 2,
      timeout = 10000,
      pass = "postgres",
      port = 5432,
      dbUser = "postgres"
    }: {
      sourcePgConnectionId: string;
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
    this._sourcePgConnectionId = sourcePgConnectionId;
    this._applicationName = applicationName;
    this._db = db;
    this._host = host;
    this._maxPoolSize = maxPoolSize;
    this._minPoolSize = minPoolSize;
    this._timeout = timeout;
    this._pass = pass;
    this._port = port;
    this._dbUser = dbUser;

    PgOrm.generateDefaultPgOrmMethods(this, {

        pgInsert$: {

          sql: () => `insert into cell_meta.pg_connection
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          params$: () => rx.of([ this.sourcePgConnectionId, this.name, this.description,
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

    return new RxPg({
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

  }

  /**
   *
   * Get$.
   *
   */
  public static get$(pg: RxPg, sourcePgConnectionId: string): rx.Observable<SourcePgConnection> {

    return PgOrm.select$<SourcePgConnection>({
      pg: pg,
      sql: `
        select
          pg_connection_id as "sourcePgConnectionId",
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
      params: () => [ sourcePgConnectionId ],
      type: SourcePgConnection
    })

  }

}
