
/**
 * loginNewInput
 * @targetNSAlias `q1`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/Skeleton.Framework`
 */
export interface LoginNewInput {
    /** xs:string */
    Browser?: string;
    /** xs:string */
    ID_Application?: string;
    /** xs:string */
    ID_ApplicationPart?: string;
    /** guid|xs:string|pattern */
    ID_PersistentLogin?: string;
    /** xs:string */
    IP?: string;
    /** xs:boolean */
    IsPersistent?: string;
    /** xs:boolean */
    IsValidation?: string;
    /** xs:string */
    Password?: string;
    /** xs:string */
    Username?: string;
}
