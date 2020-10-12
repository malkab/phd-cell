/*

    This script backs up data.data and meta.gridderjobslog and
    the involved stats

    Document and store them to git/phd/Docs/2018-07-distributed_computing_test_run

*/

\copy data.data to 'gridderlogs/out/data_data.csv' with csv header

\copy meta.gridderjobslog to 'gridderlogs/out/meta_gridderjobslog.csv' with csv header

\i gridderlogs/refresh_materialized_views.sql

\copy (select * from meta.mvw__report__gridderjobsanalysis) to 'gridderlogs/out/meta_mvw__report__gridderjobsanalysis.csv' with csv header

\copy (select * from meta.mvw__report__griddersubjobsanalysis) to 'gridderlogs/out/meta_mvw__report__griddersubjobsanalysis.csv' with csv header

\copy (select * from meta.mvw__report__gridderjobslog) to 'gridderlogs/out/meta_mvw__report__gridderjobslog.csv' with csv header
