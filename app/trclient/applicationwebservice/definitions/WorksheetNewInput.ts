
/**
 * worksheetNewInput
 * @targetNSAlias `q10`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/Skeleton.Framework`
 */
export interface WorksheetNewInput {
    /** xs:dateTime */
    DateWork?: string;
    /** xs:decimal */
    Hours?: string;
    /** guid|xs:string|pattern */
    ID_Login?: string;
    /** xs:int */
    ID_Request?: string;
    /** xs:int */
    ID_User?: string;
    /** xs:string */
    Note?: string;
}
