-- select cell__setcell(('eu-grid', 3035, 11, 2943, 4430, '{"2":[["5",4]]}'::jsonb)::cell__cell);


-- -- cell: zoom: 10, x: 2943, y: 4430, data: {"2":[["5",4]]}kkkk

select
    x, y, zoom, data
from
    data.data
where zoom = 1;


select 
select
    -- x, y,
    -- jsonb_build_object('c', data, 2, data) as data
    x, y,

    array_agg(data) as data
from (

    select
        x, y, 
        jsonb_build_object('c', data #> '{c}')::text as data
    from 
        data.data
    where
        grid_id='eu-grid' and
        zoom=1 and
        x between 3 and 4 and
        y between 4 and 5 and
        data -> 'c' is not null

    union

    select
        x, y, 
        jsonb_build_object('2', data #> '{2}')::text as data
    from 
        data.data
    where
        grid_id='eu-grid' and
        zoom=1 and
        x between 3 and 4 and
        y between 4 and 5 and
        data -> '2' is not null

) a
group by x, y


;
