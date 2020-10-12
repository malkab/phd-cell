-- Refreshes analysis materialized views

refresh materialized view meta.mvw__report__gridderjobslog;

refresh materialized view logs_aux.mvw__workergriddersubjob;

refresh materialized view logs_aux.mvw__griddersubjobsanalysis_totaltime;

refresh materialized view logs_aux.mvw__griddersubjobsanalysis_queuedtime;

refresh materialized view logs_aux.mvw__griddersubjobsanalysis_computingtime;

refresh materialized view logs_aux.mvw__griddersubjobsanalysis_postprocessingtime;

refresh materialized view logs_aux.mvw__griddersubjobsanalysis_griddersubjobinfo;

refresh materialized view meta.mvw__report__griddersubjobsanalysis;

refresh materialized view meta.mvw__report__gridderjobsanalysis;
