-- Deletes cell (0,2,2) where performance tests are run

delete from data.data where zoom=0 and x=2 and y=2;

delete from data.data where zoom=1 and x between 4 and 5 and y between 4 and 5;

delete from data.data where zoom=2 and x between 20 and 29 and y between 20 and 29;

delete from data.data where zoom=3 and x between 40 and 59 and y between 40 and 59;

delete from data.data where zoom=4 and x between 200 and 299 and y between 200 and 299;

delete from data.data where zoom=5 and x between 400 and 599 and y between 400 and 599;
