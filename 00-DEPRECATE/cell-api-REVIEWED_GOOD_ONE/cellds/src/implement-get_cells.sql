select zoom, x, y, data from data.data;

select
    zoom, x, y,
    array_agg(varid) as variable_id,
    array_agg(data) as data
from (
    select 
        zoom, x, y, 
        varid,
        jsonb_build_array(array_agg(var)) #> '{0}' as data
    from (
        -- One block like this for each addressed variable
        select
            zoom, x, y, 
            --variable name
            'c'::text as varid, 
            var
        from (
            select 
                zoom, x, y,
                -- variable selection
                jsonb_array_elements(data -> 'c') as var
            from
                data.data
        ) a
        -- filter second catalog to be '7'
        where var #>> '{1}' = '7'

        -- Proposed filter syntax
        -- c.*.[7]

        union

        select
            zoom, x, y, 
            '0'::text as varid,
            var
        from (
            select 
                zoom, x, y,
                jsonb_array_elements(data -> '0') as var
            from
                data.data
        ) a
        -- filter first catalog to be 'b' or '2'
        -- and variable value bigger than 0.5
        where var #>> '{0}' in ('b', '2') and
        (var #>> '{-1}')::float > 0.5

        -- Proposed filter syntax
        -- 0.[b, 2].greaterThan(0.5)
    ) a
    group by zoom, x, y, varid
) data
group by zoom, x, y



;
