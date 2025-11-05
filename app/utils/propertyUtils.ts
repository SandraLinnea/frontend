import { toApiUrl } from "./fetch";
import type { NewProperty, Property } from "../types/property";

export default class PropertyService {
  async createProperty(input: Partial<NewProperty>): Promise<Response> {
    const url = toApiUrl("/property");
    return fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  }
}
