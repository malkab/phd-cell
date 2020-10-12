













/*

    All CellDS definitions must extend this interface

*/

// export interface ICellDSObjectDefinition {
//     hash: string;
//     name: string;
//     type: ICellDSObjectERMInfo;
//     description: string;
//     definition: any;
// }


/*

    CellDS objects descriptive data set for
    creating lists of existing objects at the DB

*/

// export interface ICellDSObjectList {
//     hash: string;
//     type: ICellDSObjectERMInfo;
//     name: string;
//     description: string;
// }


// /*

//     CellDS object full descriptive data

// */

// export interface ICellDSObjectFull extends ICellDSObjectList {
//     params: any;            // specific creation params
//     payload: any;           // specific additional data the object may have
// }




/*

    All CellDS database objects must implement this interface

    Also, all DB objects classes must have a constructor that
    sets the parentCellDS

*/

// export interface ICellDSObject {
//     parentCellDS: CellDS;-
//     hash: string;-
//     type: ICellDSObjectERMInfo;-
//     name: string;-
//     description: string;-
//     definition: any;-
//     listDescription: ICellDSObject;             // List description
//     // fullDescription: ICellDSObject;             // Full API description
//     definitionInit(definition: ICellDSObjectDefinition): Promise<ICellDSObject>;
//     readFromCellDS(hash: string): Promise<ICellDSObject>;
//     listObjectsInCellDS(): Promise<ICellDSObject[]>;
//     writeToCellDS(): Promise<ICellDSObject>;
//     updateToCellDS(): Promise<ICellDSObject>;
//     writeToRedis(): Promise<string>;
//     deleteFromCellDS(hash: string): Promise<ICellDSObject>;
// }

























    /*

        Get a database object by hash

    */

    public async deleteCellDBObject<T extends CellDSObject>(
        c: { new(parentCellDS: CellDS): T }, hash: string
    ): Promise<CellDSObject> {

        const dbo = new c(this);

        return dbo.deleteFromCellDS(hash);

    }


}
