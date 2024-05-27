
/**
 * requestNewInput
 * @targetNSAlias `q42`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/Skeleton.Framework`
 */
export interface RequestNewInput {
    /** xs:dateTime */
    DateDue?: string;
    /** xs:dateTime */
    DateReminder?: string;
    /** xs:string */
    DisplayName?: string;
    /** xs:decimal */
    Estimate?: string;
    /** xs:decimal */
    Hours?: string;
    /** xs:int */
    ID_Category?: string;
    /** guid|xs:string|pattern */
    ID_Login?: string;
    /** xs:int */
    ID_Project?: string;
    /** xs:string */
    ID_Severity?: string;
    /** xs:int */
    ID_Source?: string;
    /** xs:int */
    ID_UserAssigned?: string;
    /** xs:int */
    ID_UserTester?: string;
    /** xs:int */
    ID_Version?: string;
    /** xs:boolean */
    IsHidden?: string;
    /** xs:string */
    Note?: string;
}
