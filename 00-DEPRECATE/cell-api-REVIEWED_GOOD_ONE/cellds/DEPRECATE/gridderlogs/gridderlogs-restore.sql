/*

    This script restores data.data and meta.gridderjobslog

    Document and store them to git/phd/Docs/2018-07-distributed_computing_test_run

*/

\copy data.data from 'in/data_data.csv' with csv header

\copy meta.gridderjobslog from 'in/meta_gridderjobslog.csv' with csv header