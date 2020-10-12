/*

    Interface for persistable objects

*/

import { ICellObject } from "./cellobject";

export interface IPersistable {

    id: string;
    type: string;
    persist: ICellObject;
    key: string;

}