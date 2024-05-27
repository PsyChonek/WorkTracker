import {
  CategoryAllProjectInput,
  CategoryAllProjectOutput,
  LoginNewInput,
  LoginNewResponse,
  LoginNewResult,
  ProjectAllUserInput,
  ProjectAllUserOutput,
  RequestAllInput,
  RequestAllOutput,
  RequestDetailInput,
  RequestDetailResult,
  RequestEditInput,
  RequestNewInput,
  RequestNewResult,
  SeverityAllInput,
  SeverityAllOutput,
  UserAllInput,
  UserAllOutput,
  WorksheetAllInput,
  WorksheetAllOutput,
  WorksheetDelInput,
  WorksheetDelResponse,
  WorksheetEditInput,
  WorksheetEditResult,
  WorksheetNewInput,
  WorksheetNewResult,
} from "./applicationwebservice/index";
import { PostRequest, CustomArrayParser, CustomObjectParser } from "./clientHelpers";

/**
 * Sends a SOAP request to retrieve all data based on the provided input.
 *
 * Bullshit alert: All methods return Output[] but Detail returns Result, both should be Result.
 */

export async function CategoryAllProject(input: CategoryAllProjectInput, url: string): Promise<CategoryAllProjectOutput[]> {
  var result: CategoryAllProjectOutput[] = [];
  const action = "CategoryAllProject";

  var body = `
    <skel:categoryAllProjectInput>
      ${input.DisplayName ? `<skel1:DisplayName>${input.DisplayName}</skel1:DisplayName>` : ""}
      ${input.ID ? `<skel1:ID>${input.ID}</skel1:ID>` : ""}
      ${input.ID_Login ? `<skel1:ID_Login>${input.ID_Login}</skel1:ID_Login>` : ""}
      ${input.ID_Project ? `<skel1:ID_Project>${input.ID_Project}</skel1:ID_Project>` : ""}
    </skel:categoryAllProjectInput>
  `;

  var raw = await PostRequest(body, action, url);
  result = CustomArrayParser(raw);
  return result;
}

export async function ProjectAllUser(input: ProjectAllUserInput, url: string): Promise<ProjectAllUserOutput[]> {
  var result: ProjectAllUserOutput[] = [];
  const action = "ProjectAllUser";

  var body = `
    <skel:projectAllUserInput>
      ${input.DisplayName ? `<skel1:DisplayName>${input.DisplayName}</skel1:DisplayName>` : ""}
      ${input.ID ? `<skel1:ID>${input.ID}</skel1:ID>` : ""}
      ${input.ID_Login ? `<skel1:ID_Login>${input.ID_Login}</skel1:ID_Login>` : ""}
      ${input.ID_User ? `<skel1:ID_User>${input.ID_User}</skel1:ID_User>` : ""}
      ${input.IsWorksheet ? `<skel1:IsWorksheet>${input.IsWorksheet}</skel1:IsWorksheet>` : ""}
      ${input.Top ? `<skel1:Top>${input.Top}</skel1:Top>` : ""}
    </skel:projectAllUserInput>
  `;

  var raw = await PostRequest(body, action, url);
  result = CustomArrayParser(raw);
  return result;
}

export async function RequestAll(input: RequestAllInput, url: string): Promise<RequestAllOutput[]> {
  var result: RequestAllOutput[] = [];
  const action = "RequestAll";

  var body = `
    <skel:requestAllInput>
      ${input.ID_Category ? `<skel1:ID_Category>${input.ID_Category}</skel1:ID_Category>` : ""}
      ${input.ID_Login ? `<skel1:ID_Login>${input.ID_Login}</skel1:ID_Login>` : ""}
      ${input.ID_Project ? `<skel1:ID_Project>${input.ID_Project}</skel1:ID_Project>` : ""}
      ${input.ID_RequestStateArray ? `<skel1:ID_RequestStateArray>${input.ID_RequestStateArray}</skel1:ID_RequestStateArray>` : ""}
      ${input.ID_Severity ? `<skel1:ID_Severity>${input.ID_Severity}</skel1:ID_Severity>` : ""}
      ${input.ID_Source ? `<skel1:ID_Source>${input.ID_Source}</skel1:ID_Source>` : ""}
      ${input.ID_UserAssigned ? `<skel1:ID_UserAssigned>${input.ID_UserAssigned}</skel1:ID_UserAssigned>` : ""}
      ${input.ID_UserInsert ? `<skel1:ID_UserInsert>${input.ID_UserInsert}</skel1:ID_UserInsert>` : ""}
      ${input.ID_Version ? `<skel1:ID_Version>${input.ID_Version}</skel1:ID_Version>` : ""}
      ${input.IsHidden ? `<skel1:IsHidden>${input.IsHidden}</skel1:IsHidden>` : ""}
      ${input.Text ? `<skel1:Text>${input.Text}</skel1:Text>` : ""}
      ${input.Top ? `<skel1:Top>${input.Top}</skel1:Top>` : ""}
    </skel:requestAllInput>
    `;

  var raw = await PostRequest(body, action, url);
  result = CustomArrayParser(raw);
  return result;
}

export async function RequestDetail(input: RequestDetailInput, url: string): Promise<RequestDetailResult> {
  var result: RequestDetailResult = {};
  const action = "RequestDetail";

  var body = `
    <skel:requestDetailInput>
      ${input.ID ? `<skel1:ID>${input.ID}</skel1:ID>` : ""}
      ${input.ID_Login ? `<skel1:ID_Login>${input.ID_Login}</skel1:ID_Login>` : ""}
    </skel:requestDetailInput>
    `;

  var raw = await PostRequest(body, action, url);
  result = CustomObjectParser(raw);
  return result;
}

export async function RequestEdit(input: RequestEditInput, url: string): Promise<RequestDetailResult> {
  var result: RequestDetailResult = {};
  const action = "RequestEdit";

  var body = `
    <skel:requestEditInput>
      ${input.DateDue ? `<skel1:DateDue>${input.DateDue}</skel1:DateDue>` : ""}
      ${input.DateReminder ? `<skel1:DateReminder>${input.DateReminder}</skel1:DateReminder>` : ""}
      ${input.DisplayName ? `<skel1:DisplayName>${input.DisplayName}</skel1:DisplayName>` : ""}
      ${input.Estimate ? `<skel1:Estimate>${input.Estimate}</skel1:Estimate>` : ""}
      ${input.Hours ? `<skel1:Hours>${input.Hours}</skel1:Hours>` : ""}
      ${input.ID ? `<skel1:ID>${input.ID}</skel1:ID>` : ""}
      ${input.ID_Category ? `<skel1:ID_Category>${input.ID_Category}</skel1:ID_Category>` : ""}
      ${input.ID_Login ? `<skel1:ID_Login>${input.ID_Login}</skel1:ID_Login>` : ""}
      ${input.ID_Project ? `<skel1:ID_Project>${input.ID_Project}</skel1:ID_Project>` : ""}
      ${input.ID_RequestState ? `<skel1:ID_RequestState>${input.ID_RequestState}</skel1:ID_RequestState>` : ""}
      ${input.ID_Severity ? `<skel1:ID_Severity>${input.ID_Severity}</skel1:ID_Severity>` : ""}
      ${input.ID_Source ? `<skel1:ID_Source>${input.ID_Source}</skel1:ID_Source>` : ""}
      ${input.ID_UserAssigned ? `<skel1:ID_UserAssigned>${input.ID_UserAssigned}</skel1:ID_UserAssigned>` : ""}
      ${input.ID_UserTester ? `<skel1:ID_UserTester>${input.ID_UserTester}</skel1:ID_UserTester>` : ""}
      ${input.ID_Version ? `<skel1:ID_Version>${input.ID_Version}</skel1:ID_Version>` : ""}
      ${input.IsHidden ? `<skel1:IsHidden>${input.IsHidden}</skel1:IsHidden>` : ""}
      ${input.IsInvoiced ? `<skel1:IsInvoiced>${input.IsInvoiced}</skel1:IsInvoiced>` : ""}
    </skel:requestEditInput>
  `;

  var raw = await PostRequest(body, action, url);
  result = CustomObjectParser(raw);
  return result;
}

export async function RequestNew(input: RequestNewInput, url: string): Promise<RequestNewResult> {
  var result: RequestNewResult = {};
  const action = "RequestNew";

  var body = `
  <skel:requestNewInput>
    ${input.DateDue ? `<skel1:DateDue>${input.DateDue}</skel1:DateDue>` : ""}
    ${input.DateReminder ? `<skel1:DateReminder>${input.DateReminder}</skel1:DateReminder>` : ""}
    ${input.DisplayName ? `<skel1:DisplayName>${input.DisplayName}</skel1:DisplayName>` : ""}
    ${input.Estimate ? `<skel1:Estimate>${input.Estimate}</skel1:Estimate>` : ""}
    ${input.Hours ? `<skel1:Hours>${input.Hours}</skel1:Hours>` : ""}
    ${input.ID_Category ? `<skel1:ID_Category>${input.ID_Category}</skel1:ID_Category>` : ""}
    ${input.ID_Login ? `<skel1:ID_Login>${input.ID_Login}</skel1:ID_Login>` : ""}
    ${input.ID_Project ? `<skel1:ID_Project>${input.ID_Project}</skel1:ID_Project>` : ""}
    ${input.ID_Severity ? `<skel1:ID_Severity>${input.ID_Severity}</skel1:ID_Severity>` : ""}
    ${input.ID_Source ? `<skel1:ID_Source>${input.ID_Source}</skel1:ID_Source>` : ""}
    ${input.ID_UserAssigned ? `<skel1:ID_UserAssigned>${input.ID_UserAssigned}</skel1:ID_UserAssigned>` : ""}
    ${input.ID_UserTester ? `<skel1:ID_UserTester>${input.ID_UserTester}</skel1:ID_UserTester>` : ""}
    ${input.ID_Version ? `<skel1:ID_Version>${input.ID_Version}</skel1:ID_Version>` : ""}
    ${input.IsHidden ? `<skel1:IsHidden>${input.IsHidden}</skel1:IsHidden>` : ""}
    ${input.Note ? `<skel1:Note>${input.Note}</skel1:Note>` : ""}
  </skel:requestNewInput>
  `;
  var raw = await PostRequest(body, action, url);
  result = CustomObjectParser(raw);
  return result;
}

export async function SeverityAll(input: SeverityAllInput, url: string): Promise<SeverityAllOutput[]> {
  var result: SeverityAllOutput[] = [];
  const action = "SeverityAll";

  var body = `
    <skel:severityAllInput>
      ${input.DisplayName ? `<skel1:DisplayName>${input.DisplayName}</skel1:DisplayName>` : ""}
      ${input.ID ? `<skel1:ID>${input.ID}</skel1:ID>` : ""}
      ${input.ID_Login ? `<skel1:ID_Login>${input.ID_Login}</skel1:ID_Login>` : ""}
    </skel:severityAllInput>
  `;

  var raw = await PostRequest(body, action, url);
  result = CustomArrayParser(raw);
  return result;
}

export async function WorksheetAll(input: WorksheetAllInput, url: string): Promise<WorksheetAllOutput[]> {
  var result: WorksheetAllOutput[] = [];
  const action = "WorksheetAll";

  var body = `
  <skel:worksheetAllInput>
    ${input.DateFrom ? `<skel1:DateFrom>${input.DateFrom}</skel1:DateFrom>` : ""}
    ${input.DateTo ? `<skel1:DateTo>${input.DateTo}</skel1:DateTo>` : ""}
    ${input.ID_Login ? `<skel1:ID_Login>${input.ID_Login}</skel1:ID_Login>` : ""}
    ${input.ID_Project ? `<skel1:ID_Project>${input.ID_Project}</skel1:ID_Project>` : ""}
    ${input.ID_Request ? `<skel1:ID_Request>${input.ID_Request}</skel1:ID_Request>` : ""}
    ${input.ID_User ? `<skel1:ID_User>${input.ID_User}</skel1:ID_User>` : ""}
    ${input.IsNow ? `<skel1:IsNow>${input.IsNow}</skel1:IsNow>` : ""}
    ${input.Month ? `<skel1:Month>${input.Month}</skel1:Month>` : ""}
    ${input.Note ? `<skel1:Note>${input.Note}</skel1:Note>` : ""}
    ${input.Top ? `<skel1:Top>${input.Top}</skel1:Top>` : ""}
    ${input.Year ? `<skel1:Year>${input.Year}</skel1:Year>` : ""}
  </skel:worksheetAllInput>
  `;

  var raw = await PostRequest(body, action, url);
  result = CustomArrayParser(raw);
  return result;
}

export async function WorksheetEdit(input: WorksheetEditInput, url: string): Promise<WorksheetEditResult> {
  var result: WorksheetEditResult = {};
  const action = "WorksheetEdit";

  var body = `
  <skel:worksheetEditInput>
    ${input.DateWork ? `<skel1:DateWork>${input.DateWork}</skel1:DateWork>` : ""}
    ${input.Hours ? `<skel1:Hours>${input.Hours}</skel1:Hours>` : ""}
    ${input.ID ? `<skel1:ID>${input.ID}</skel1:ID>` : ""}
    ${input.ID_Login ? `<skel1:ID_Login>${input.ID_Login}</skel1:ID_Login>` : ""}
    ${input.ID_Request ? `<skel1:ID_Request>${input.ID_Request}</skel1:ID_Request>` : ""}
    ${input.ID_User ? `<skel1:ID_User>${input.ID_User}</skel1:ID_User>` : ""}
    ${input.Note ? `<skel1:Note>${input.Note}</skel1:Note>` : ""}
  </skel:worksheetEditInput>
  `;
  var raw = await PostRequest(body, action, url);
  result = CustomObjectParser(raw);
  return result;
}

export async function WorksheetNew(input: WorksheetNewInput, url: string): Promise<WorksheetNewResult> {
  var result: WorksheetNewResult = {};
  const action = "WorksheetNew";

  var body = `
  <skel:worksheetNewInput>
    ${input.DateWork ? `<skel1:DateWork>${input.DateWork}</skel1:DateWork>` : ""}
    ${input.Hours ? `<skel1:Hours>${input.Hours}</skel1:Hours>` : ""}
    ${input.ID_Login ? `<skel1:ID_Login>${input.ID_Login}</skel1:ID_Login>` : ""}
    ${input.ID_Request ? `<skel1:ID_Request>${input.ID_Request}</skel1:ID_Request>` : ""}
    ${input.ID_User ? `<skel1:ID_User>${input.ID_User}</skel1:ID_User>` : ""}
    ${input.Note ? `<skel1:Note>${input.Note}</skel1:Note>` : ""}
  </skel:worksheetNewInput>
  `;

  var raw = await PostRequest(body, action, url);
  result = CustomObjectParser(raw);
  return result;
}

export async function WorksheetDel(input: WorksheetDelInput, url: string): Promise<WorksheetDelResponse> {
  var result: WorksheetDelResponse = {};
  const action = "WorksheetDel";

  var body = `
  <skel:worksheetDelInput>
    ${input.ID ? `<skel1:ID>${input.ID}</skel1:ID>` : ""}
    ${input.ID_Login ? `<skel1:ID_Login>${input.ID_Login}</skel1:ID_Login>` : ""}
  </skel:worksheetDelInput>
  `;

  var raw = await PostRequest(body, action, url);
  result = CustomObjectParser(raw);
  return result;
}

export async function UserAll(input: UserAllInput, url: string): Promise<UserAllOutput[]> {
  var result: UserAllOutput[] = [];
  const action = "UserAll";

  var body = `
    <skel:userAllInput>
      ${input.DisplayName ? `<skel1:DisplayName>${input.DisplayName}</skel1:DisplayName>` : ""}
      ${input.Email ? `<skel1:Email>${input.Email}</skel1:Email>` : ""}
      ${input.ID ? `<skel1:ID>${input.ID}</skel1:ID>` : ""}
      ${input.ID_Login ? `<skel1:ID_Login>${input.ID_Login}</skel1:ID_Login>` : ""}
      ${input.ID_RoleArray ? `<skel1:ID_RoleArray>${input.ID_RoleArray}</skel1:ID_RoleArray>` : ""}
      ${input.Password ? `<skel1:Password>${input.Password}</skel1:Password>` : ""}
      ${input.Top ? `<skel1:Top>${input.Top}</skel1:Top>` : ""}
      ${input.Username ? `<skel1:Username>${input.Username}</skel1:Username>` : ""}
    </skel:userAllInput>
  `;

  var raw = await PostRequest(body, action, url);
  result = CustomArrayParser(raw);
  return result;
}

export async function LoginNew(input: LoginNewInput, url: string): Promise<LoginNewResult> {
  var result: LoginNewResult = {};
  const action = "LoginNew";

  var body = `
    <skel:loginNewInput>
      ${input.Password ? `<skel1:Password>${input.Password}</skel1:Password>` : ""}
      ${input.Username ? `<skel1:Username>${input.Username}</skel1:Username>` : ""}
    </skel:loginNewInput>
  `;

  var raw = await PostRequest(body, action, url);
  result = CustomObjectParser(raw);
  return result;
}