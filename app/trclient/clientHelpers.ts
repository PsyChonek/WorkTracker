import axios, { AxiosResponse } from "axios";

const options = { compact: true, ignoreComment: true, spaces: 4 };
const convert = require("xml-js");

/**
 * Returns a SOAP envelope string with the provided body and action.
 * @param body - The body of the SOAP envelope.
 * @param action - The action of the SOAP envelope.
 * @returns A string representing the SOAP envelope.
 */
const Envelope = (body: string, action: string) => {
  return `
  <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:skel="http://www.skeleton.cz/skeleton-framework" xmlns:skel1="http://schemas.datacontract.org/2004/07/Skeleton.Framework">
    <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
      <wsa:Action>http://www.skeleton.cz/skeleton-framework/IApplicationWebservice/${action}</wsa:Action>
    </soap:Header> 
    <soap:Body>
        <skel:${action}>
          ${body}
        </skel:${action}>
      </soap:Body>
    </soap:Envelope>
    `;
};

/**
 * Custom array parser function that transforms the raw data into an array of Type objects.
 * @param raw - The raw data to be parsed.
 * @param result - The array of Type objects to be populated.
 * @returns An array of Type objects.
 */
export function CustomArrayParser<Type extends object>(raw: Type[]) {
  // Remove _text and _attributes keys
  if (!Array.isArray(raw)) {
    raw = [raw];
  }

  raw.forEach((item: any) => {
    item = Transform(item);
  });

  // Check if array contains only one item and is empty
  if (raw.length === 1 && Object.keys(raw[0]).length === 0) {
    return [];
  }

  return raw;
}

/**
 * Custom parser function that transforms the raw data into an array of Type objects.
 * @param raw - The raw data to be parsed.
 * @param result - The array of Type objects to be populated.
 * @returns An array of Type objects.
 */
export function CustomObjectParser<Type>(raw: Type) {
  var object = raw;

  // Remove _text and _attributes keys
  object = Transform(object);

  return object;
}

/**
 * Sends a POST request to the specified URL with the given SOAP body and action.
 * @param body - The SOAP body to send in the request.
 * @param action - The SOAP action to include in the request headers.
 * @param url - The URL to send the request to.
 * @returns The raw response from the server.
 */
export async function PostRequest(body: string, action: string, url: string) {
  const content = Envelope(body, action);
  const response = await Post(content, url);
  const xml = Clean(response.data);

  // Check if has output else return Result
  if (xml.includes(`${action}Output`)) {
    var raw = convert.xml2js(xml, options)["s:Envelope"]["s:Body"][`${action}Response`][`${action}Result`][`${action}Output`];
    return raw;
  }
  if (xml.includes(`${action}Result`)) {
    var raw = convert.xml2js(xml, options)["s:Envelope"]["s:Body"][`${action}Response`][`${action}Result`];
    // remove _attributes from object
    raw = removeAttributes(raw);
    return raw;
  }
  if (xml.includes(`${action}Response`)) {
    var raw = convert.xml2js(xml, options)["s:Envelope"]["s:Body"][`${action}Response`];
    // remove _attributes from object
    raw = removeAttributes(raw);
    return raw;
  }
  return raw;
}

/**
 * Removes all occurrences of the prefix "a:" from the given string, and b:
 * @param obj - The string to be cleaned.
 * @returns The cleaned string.
 */
function Clean(obj: string): string {
  var obj = obj.replace(/b:/g, "");
  return obj.replace(/a:/g, "");
}

/**
 * Recursively transforms an object, returning the value of "_text" or "i:nil" keys,
 * the first object in the "_attributes" array, or the object itself.
 * @param obj - The object to transform
 * @returns The transformed object
 */
function Transform(obj: any): any {
  for (const key in obj) {
    if (key === "_text" || key === "i:nil") {
      return obj[key]; // Return the value if the key is "_text" or "i:nil"
    } else if (key === "_attributes" && Array.isArray(obj[key]) && obj[key].length > 0) {
      return Transform(obj[key][0]); // Return the first object in the array if the key is "_attributes"
    } else if (key === "_attributes" && typeof obj[key] === "object") {
      return Transform(obj[key]); // Return the object if the key is "_attributes"
    } else if (typeof obj[key] === "object") {
      obj[key] = Transform(obj[key]); // Recursively check nested objects
    }
  }
  return obj;
}

/**
 * Sends a POST request to the specified URL with the given content and SOAPAction header.
 * @param content - The content to send in the request body.
 * @param url - The URL to send the request to.
 * @returns A Promise that resolves with the AxiosResponse object returned by the server.
 */
async function Post(content: string, url: string): Promise<AxiosResponse> {
  return await axios.post(url, content, {
    headers: {
      "Content-Type": "application/soap+xml",
      Accept: "application/soap+xml",
    },
  });
}

function removeAttributes(obj: any) {
  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        obj[i] = removeAttributes(obj[i]);
      }
    } else {
      for (let key in obj) {
        // remove _attributes from object if exists and is i:nill: true set value to null
        if (key === "_attributes") {
          if (obj[key]["i:nil"] === "true") {
            obj = null;
          } else {
          delete obj[key];
          }
        } else {
          obj[key] = removeAttributes(obj[key]);
        }
      }
    }
  }
  return obj;
}
