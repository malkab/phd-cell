begin;


-- Register grid

insert into cell_meta.grid
values (
    'eu-grid',
    '
        {
            "name": "eu-grid",
            "description": "A grid based on the official EU one",
            "longdescription": "This is another description, long one",
            "origin": {
                "epsg": "3035",
                "x": 2700000,
                "y": 1500000
            },
            "zoomlevels": [
                {"name": "100 km", "size": 100000},
                {"name": "50 km", "size": 50000},
                {"name": "10 km", "size": 10000},
                {"name": "5 km", "size": 5000},
                {"name": "1 km", "size": 1000},
                {"name": "500 m", "size": 500},
                {"name": "250 m", "size": 250},
                {"name": "125 m", "size": 125},
                {"name": "25 m", "size": 25},
                {"name": "5 m", "size": 5}
            ]
        }
    '::jsonb
);



commit;
