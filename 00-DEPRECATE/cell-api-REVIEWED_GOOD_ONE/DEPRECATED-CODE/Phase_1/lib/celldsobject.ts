





    // Definition
    // private _creationParams: ICellDSObjectDefinition;










    // // get creationParams(): ICellDSObjectDefinition {
    // //     return this._creationParams;
    // // }

    // // get listDescription(): ICellDSObjectList {
    // //     return {
    // //         description: this._description,
    // //         hash: this._hash,
    // //         name: this._name,
    // //         type: null
    // //     };
    // // }

    // // get fullDescription(): ICellDSObjectFull {
    // //     return {
    // //         hash: this._hash,
    // //         type: this._type,
    // //         name: this._name,
    // //         description: this._description,
    // //         params: this._creationParams.params,
    // //         payload: this.payload
    // //     };
    // // }



    // // get payload(): any {
    // //     return null;
    // // }

    // set hash(hash: string) {
    //     this._hash = hash;
    // }



    // get name(): string {
    //     return this._name;
    // }

    // get description(): string {
    //     return this._description;
    // }

    // get definition(): any {
    //     return this._definition;
    // }




















    /*

        Delete from CellDS

    */

    public async deleteFromCellDS(hash: string): Promise<CellDSObject> {
        throw "deleteFromCellDS not implemented";
    }

}