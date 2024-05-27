
/**
 * requestAllInput
 * @targetNSAlias `q28`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/Skeleton.Framework`
 */
export interface RequestAllInput {
    /** xs:int */
    ID_Category?: string;
    /** guid|xs:string|pattern */
    ID_Login?: string;
    /** xs:int */
    ID_Project?: string;
    /** q6:ArrayOfstring */
    ID_RequestStateArray?: string;
    /** xs:string */
    ID_Severity?: string;
    /** xs:int */
    ID_Source?: string;
    /** xs:int */
    ID_UserAssigned?: string;
    /** xs:int */
    ID_UserInsert?: string;
    /** xs:int */
    ID_Version?: string;
    /** xs:boolean */
    IsHidden?: string;
    /** xs:string */
    Text?: string;
    /** xs:int */
    Top?: string;
}
