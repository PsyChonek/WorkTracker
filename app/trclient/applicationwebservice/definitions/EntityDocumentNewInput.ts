
/**
 * entityDocumentNewInput
 * @targetNSAlias `q14`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/Skeleton.Framework`
 */
export interface EntityDocumentNewInput {
    /** xs:base64Binary */
    Content?: string;
    /** xs:string */
    Description?: string;
    /** xs:string */
    FileNameExtension?: string;
    /** xs:string */
    ID_EntityDocumentCategory?: string;
    /** xs:string */
    ID_EntityType?: string;
    /** guid|xs:string|pattern */
    ID_Login?: string;
    /** xs:int */
    ID_Object?: string;
    /** xs:string */
    ID_Role?: string;
}
