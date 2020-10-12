/*

    Gridder log status for griddersubjobs logs

*/

export enum EGridderLogStatus {
    INITIALJOB = 500,                               // Compulsory
    INITIALGEOMS = 550,                             // Compulsory
    CREATED = 1000,                                 // Compulsory
    QUEUED = 2000,                                  // Compulsory
    PULLED = 3000,                                  // Compulsory
    WORKERSTART = 4000,                             // Compulsory
    CALCULATIONSTART = 5000,                        // Compulsory
    GEOMSFOUND = 5200,
    INTERSECTIONDONE = 5300,
    AGGREGATIONDONE = 5400,
    CALCULATIONEND = 6000,                          // Compulsory
    POSTPROCESSINGSTART = 7000,                     // Compulsory
    CELLUPDATED = 7100,
    NOCELLUPDATED = 7200,
    NEWSUBCELLS = 7500,
    NONEWSUBCELLS = 7600,
    POSTPROCESSINGEND = 8000,                       // Compulsory
    WORKEREND = 9000                                // Compulsory
}
