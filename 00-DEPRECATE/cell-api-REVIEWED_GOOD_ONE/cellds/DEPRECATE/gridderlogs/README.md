THIS CODE IS DEPRECATED. IT WAS USED TO EXTRACT GRIDDERJOB PERFORMANCE INFO FROM THE OLD GRIDDERJOBSLOG. NOT USED ANYMORE BECAUSE STATS ARE NOW STORED IN REDIS.

This scripts are for analyzing logs of gridding processes.

**Historical test runs are backed up and stored at git/PhD/docs/2018-07-distributed_computing_test_runs**.

To load a historic run, copy grid and logs data to **in**. Run **gridderlogs-restore.sql**. Then run **gridderlogs-backup.sql** to export to out grid, logs, and analysis data.

Procedure for a test:

- extract run statistics by psql'ing into kepler and running **gridderlogs-backup.sql**;
- move files in **out** to the run test storage;
- delete existing GridderWorkers service;
- configure gridderworkers service starting parameter for multiple instances;
- run the service;
- psql into cellds and delete all content from tables data.data and meta.gridderjobslog;
- delete 'GridderJob:%' and 'GridderSubJob:%' from meta.celldsobject;
- run the test from Postman;
- update the Excel file with new data.
