









/*

    Returns the SRS a grid system is defined on.

    varchar _grid_hash: Grid's ID to return the SRS.

    integer return: Grid's SRS EPSG code.

*/

create or replace function public.cell__getgridsrs(
    _grid_hash char(64)
) returns integer as
$$
    select st_srid(origin)
    from meta.grid
    where hash=_grid_hash;
$$
language sql;



/*

    Registers a new grid.

    varchar _id: Grid ID.
    geometry _origin: A point defining the origin of the grid.
    jsonb resolutions: Resolution zoom levels.

*/

create or replace function public.cell__registergrid(
    _hash char(64),
    _name varchar(250),
    _description text,
    _origin geometry,
    _resolutions jsonb
) returns void as
$$
    insert into meta.grid values(
        _hash, _name, _description, _origin, _resolutions
    );
$$
language sql;



















/*

    Returns the cell a point is on.

    varchar _grid_hash: The grid ID.
    integer _zoom: The zoom to compute the cell.
    geometry _point: The target point.

    cell__cell return: The colliding cell.

*/

create or replace function public.cell__cellonpoint(
    _grid_hash char(64),
    _zoom integer,
    _point geometry
) returns cell__cell as
$$

    select (   
        _grid_hash,
        srs,
        _zoom,
        floor((st_x(ppoint)-st_x(gridorigin)) / gridsize),
        floor((st_y(ppoint)-st_y(gridorigin)) / gridsize),
        '{}'::jsonb)::cell__cell
    from
        cell__getgridsrs(_grid_hash) as srs,
        st_transform(_point, srs) as ppoint,
        cell__getgridsize(_grid_hash, _zoom) as gridsize,
        cell__getgridorigin(_grid_hash) as gridorigin

$$
language sql;



/*

    Returns the geom of a bbox expressed as a JSONB this way:

    {"epsg": 3035, "maxx": 2924600, "maxy": 1756200, "minx": 2881000, "miny": 1720000}

*/

create or replace function cell__bboxfromjsonb(
    _bbox jsonb
) returns geometry as
$$

    with points as (
        select
            st_setsrid(st_makepoint(
                (_bbox ->> 'minx')::float, 
                (_bbox ->> 'miny')::float),
                (_bbox ->> 'epsg')::integer) as pmin,
            st_setsrid(st_makepoint(
                (_bbox ->> 'maxx')::float, 
                (_bbox ->> 'maxy')::float), 
                (_bbox ->> 'epsg')::integer) as pmax
    )
    select st_envelope(st_makeline(pmin, pmax)) from points;

$$
language sql;



/*

    Returns all cells that covers the BBOX of a geometry.

    varchar _grid_hash: The grid ID.
    integer _zoom: The target zoom.
    geometry _geom: The geometry.

    setof cell__cell return: The colliding cells.

*/

create or replace function cell__getbboxcoverage(
    _grid_hash char(64),
    _zoom integer,
    _geom geometry
) returns setof cell__cell as
$$

    select
        (_grid_hash, srid, _zoom, sx, sy, '{}'::jsonb)::cell__cell
    from
        cell__getgridsrs(_grid_hash) as srid,
        st_envelope(_geom) as env,
        cell__cellonpoint(_grid_hash, _zoom, 
            st_setsrid(st_makepoint(st_xmin(env), st_ymin(env)), srid)) as mincell,
        cell__cellonpoint(_grid_hash, _zoom, 
            st_setsrid(st_makepoint(st_xmax(env), st_ymax(env)), srid)) as maxcell,
        generate_series(mincell.x, maxcell.x) as sx,
        generate_series(mincell.y, maxcell.y) as sy;

$$
language sql;



/*

    Returns all cells that covers a geometry.

    varchar _grid_hash: The grid ID.
    integer _zoom: The target zoom.
    geometry _geom: The target geometry.

    setof cell__cell return: The colliding cells.

*/

create or replace function cell__getcoverage(
    _grid_hash char(64),
    _zoom integer,
    _geom geometry
) returns setof cell__cell as
$$

    select distinct
        (a.*)::cell__cell
    from
        cell__getbboxcoverage(_grid_hash, _zoom, _geom) a inner join
        (select _geom as geom) b on
        st_intersects(cell__cellgeom(a), b.geom);

$$
language sql;





/*

    Inserts a new JSON branch on an existing cell.

    This function makes a new branch to grow in a cell's data.
    Argument is a cell with the same definition as the cell intended
    to be modified, whose JSONB data is the definition of the new 
    branch.

    This function won't overwrite an existing branch.

    cell__cell _cell: The cell containing the new JSON payload.

*/

create or replace function public.cell__insertbranch(
    _cell cell__cell
) returns void as
$$

    insert into data.data as d
    values(
        (_cell).grid_hash,
        (_cell).epsg,
        (_cell).zoom,
        (_cell).x,
        (_cell).y,
        (_cell).data,
        cell__cellgeom(_cell),
        cell__cellgeom4326(_cell)
    ) on conflict(grid_hash, zoom, x, y) do update
    set data = cell__buildbranch(d.data, (_cell).data)
    where d.grid_hash=d.grid_hash and d.zoom=d.zoom and d.x=d.x and d.y=d.y;

$$
language sql;



/*

    cell__merge

    Merges a cell into data.data, or inserts a new indicator root if the cell exists and the new cell got new indicators in its data field. If the target indicator root exists, it is overwritten with the new value. Check cell__insertbranch to merge JSON branches into existing indicator roots.

    cell__cell _cell: Cell with the JSON payload to merge.

*/

create or replace function public.cell__merge(
    _cell cell__cell
) returns void as
$$

    insert into data.data as d
    values(
        (_cell).grid_hash,
        (_cell).epsg,
        (_cell).zoom,
        (_cell).x,
        (_cell).y,
        (_cell).data,
        cell__cellgeom(_cell),
        cell__cellgeom4326(_cell)
    ) on conflict(grid_hash, zoom, x, y) do update
    set data = d.data || (_cell).data
    where d.grid_hash=d.grid_hash and d.zoom=d.zoom and d.x=d.x and d.y=d.y;

$$
language sql;



/*

    Returns cells for a grid at a given zoom that 
    lies in an enveloped expressed by
    minx, miny, maxx, and maxy in a given EPSG.

    WARNING!: This function is not suitable for rendering
    unless the viewer projection is the same as the native
    grid one.

    _grid_hash varchar: the grid;
    _zoom integer: the zoom level;
    _epsg integer: EPSG coordinates belongs to;
    _minx, _miny float: lower left corner;
    _maxx, _maxy float: top right corner;

*/

create or replace function public.cell__getCellsInEnvelope(
    _grid_hash char(64),
    _zoom integer,
    _epsg integer,
    _minx float,
    _miny float,
    _maxx float,
    _maxy float
) returns setof data.data as
$$
    with points as (
        select
            cell__cellonpoint('eu-grid', _zoom, 
                st_setsrid(st_makepoint(_minx, _miny), _epsg)) as minp,
            cell__cellonpoint('eu-grid', _zoom, 
                st_setsrid(st_makepoint(_maxx, _maxy), _epsg)) as maxp
    )
    select data.*
    from data.data as data, points
    where
        zoom = _zoom and 
        x between (points.minp).x and (points.maxp).x and
        y between (points.minp).y and (points.maxp).y;
$$
language sql;










/*

    This function returns the path of a branch.

    For example, {"a": {"b": {"c": 56}}} returns {'a', 'b', 'c'}

*/

create or replace function public.cell__getbranchpath(
    _jsonb jsonb
) returns text[] as
$$
declare
    _key text[];
    _keys text[];
begin

    -- Initialization
    _keys = array[]::text[];

    -- Main loop
    loop

        -- Get each key in the path
        select array_agg(a) into _key from jsonb_object_keys(_jsonb #> _keys) as a;

        -- Add new key to the path
        _keys = _keys || _key;

        -- Exit when at the end is a value
        exit when jsonb_typeof(_jsonb #> _keys)<>'object';
        
    end loop;

    return _keys;

end;
$$
language plpgsql;







/*

    This function deletes a branch.

    Usage:

        select cell__deletebranch(
            '{"a": {"b": 45, "c": 47}, "b": {"c": 48}}'::jsonb,
            '{"a": {"c": 1}'::jsonb
        );

    will return

        '{"a"}: {"b": 45}, "b": {"c": 48}}'

*/

create or replace function public.cell__deletebranch(
    _data jsonb,
    _deletebranch jsonb
) returns jsonb as
$$

    select jsonb_strip_nulls(
        jsonb_set(
            _data,
            cell__getbranchpath(_deletebranch),
            'null'::jsonb
        )
    );

$$
language sql;









/*

    Builds a new JSON branch on an existing JSONB.

    This function makes a new branch to grow in an existing JSONB.
    The first argument is the JSONB to be modified, the second, the
    new branch. Branches must follow the following convention:
    
        '{"a": {"b": {"c": 343}}}'
    
    that is, must be a sequence of nested keys, with only a single 
    child, up to a final scalar data.

    This function will ever overwrite an existing branch.

    jsonb _jsonb: The JSON to write upon.
    jsonb _jsonb_new: The new branch to write.

    jsonb return: The composed JSON.

*/

create or replace function public.cell__buildbranch(
    _jsonb jsonb,
    _jsonb_new jsonb
) returns jsonb as
$$
declare
    _key text[];
    _value jsonb;
    _existing jsonb;
    _keys text[];
begin

    select cell__deletebranch(_jsonb, _jsonb_new) into _jsonb;

    -- Initialization
    _keys = array[]::text[];

    -- Main loop
    loop

        -- Get the key
        select array_agg(a) into _key
        from jsonb_object_keys(_jsonb_new #> _keys) as a;

        -- Add the new key to the sequence
        _keys = _keys || _key;

        _value = _jsonb_new #> _keys;
        _existing = _jsonb #> _keys;

        if jsonb_typeof(_existing)<>'object' or _existing is null then
            _jsonb = jsonb_set(_jsonb, _keys, _value, true);
            exit;
        end if;

    end loop;

    return _jsonb;

end;
$$
language plpgsql;

