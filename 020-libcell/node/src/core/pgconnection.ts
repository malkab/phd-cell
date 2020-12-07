import { IMetadated } from './imetadated';

/**
 *
 * A PG connection to connect to raw data.
 *
 */
export class PgConnection implements IMetadated {

  /**
   *
   * pgConnectionId.
   *
   */
  protected _pgConnectionId: string;

  get pgConnectionId(): string { return this._pgConnectionId }

  /**
   *
   * applicationName.
   *
   */
  protected _applicationName: string;

  get applicationName(): string { return this._applicationName }

  /**
   *
   * db.
   *
   */
  protected _db: string;

  get db(): string { return this._db }

  set db(db: string) { this._db = db }

  /**
   *
   * host.
   *
   */
  protected _host: string;

  get host(): string { return this._host }

  /**
   *
   * maxPoolSize.
   *
   */
  protected _maxPoolSize: number;

  get maxPoolSize(): number { return this._maxPoolSize }

  /**
   *
   * minPoolSize.
   *
   */
  protected _minPoolSize: number;

  get minPoolSize(): number { return this._minPoolSize }

  /**
   *
   * pass.
   *
   */
  protected _pass: string;

  get pass(): string { return this._pass }

  /**
   *
   * port.
   *
   */
  protected _port: number;

  get port(): number { return this._port }

  /**
   *
   * DB user.
   *
   */
  protected _dbUser: string;

  get dbUser(): string { return this._dbUser }

  /**
   *
   * Name.
   *
   */
  protected _name: string;

  get name(): string { return this._name }

  /**
   *
   * Description.
   *
   */
  protected _description: string;

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
    this._pass = pass;
    this._port = port;
    this._dbUser = dbUser;

  }

}
