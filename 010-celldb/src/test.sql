

/**

  THIS IS A WIP MIGRATING THE TYPESCRIPT FUNCTION THAT GET SUB CELLS IN A
  LOWER ZOOM LEVEL FOR A CELL

*/



  public getSubCells(zoom: number): Cell[] {

    if (this._grid) {

      const thisSize = this._grid.zoomLevels[this.zoom].size;
      const targetSize = this._grid.zoomLevels[zoom].size;
      const sizeRatio = thisSize / targetSize;

      const out: Cell[] = [];

      for (
        let x = this.x * sizeRatio ;
        x < (this.x * sizeRatio) + sizeRatio ;
        x++
      ) {

        for (
          let y = this.y * sizeRatio ;
          y < (this.y * sizeRatio) + sizeRatio ;
          y++
        ) {

          out.push(new Cell({
            gridId: this._gridId,
            zoom: zoom,
            x: x,
            y: y,
            grid: this._grid
          }));

        }

      }

    return out;

    } else {

      throw new Error("cell: undefined grid");

    }

  }

create or replace function public.cell__getsubcells(
  _cell cell__cell,
  _zoomlevel integer
) returns cell__cell as
$$
declare
    _key text;
    _value jsonb;
    _keys text[];
begin

    -- Initialization
    _cellzoomsize = cell__getzoomlevelsize(_cell.zoom);
    _targetsize = cell__getzoomlevelsize(_zoomlevel);

    raise notice '% %', _cellzoomsize, _targetsize;

    -- Main loop
    loop

        -- Traverse the structure
        _key = jsonb_object_keys(_jsonb_new);
        _keys = _keys || _key;
        _value = _jsonb_new -> _key;

        -- If route doesn't exist, create it and exit
        if _jsonb #> _keys is null then
            _jsonb = jsonb_set(_jsonb, _keys, _value);
            exit;
        end if;

        -- Iterate to next element
        _jsonb_new = _value;

        -- Safeguard to exit in case final element is reached
        -- and element already existed
        exit when jsonb_typeof(_value)<>'object';

    end loop;

    return _jsonb;

end;
$$
language plpgsql;
