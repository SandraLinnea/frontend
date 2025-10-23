export default class PropertyService {
  private base = "/api";

  async createProperty(input: Partial<import("@/types/property").NewProperty>) {
    return fetch(`${this.base}/property`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  }
}
