-- Clears data from main tables

delete from data.data;

delete from meta.celldsobject
where (cell__cellobjectid(id)).type = 'GridderSubJob';

