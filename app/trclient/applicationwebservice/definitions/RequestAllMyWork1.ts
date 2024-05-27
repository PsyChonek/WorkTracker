
/**
 * requestAllMyWork
 * @targetNSAlias `q30`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/Skeleton.Framework`
 */
export interface RequestAllMyWork1 {
    /** xs:int */
    ID_Category?: string;
    /** guid|xs:string|pattern */
    ID_Login?: string;
    /** xs:int */
    ID_Project?: string;
    /** q7:ArrayOfstring */
    ID_RequestStateArray?: string;
    /** xs:int */
    ID_User?: string;
    /** xs:int */
    ID_Version?: string;
    /** xs:string */
    Text?: string;
}
