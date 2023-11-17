import { HttpHeaders } from '@angular/common/http';

export class GlobleDeclarations
{
  static apiBaseURL = "http://localhost:7230/";

  private static GetHeader() {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return headers;
  }

  public static getHeaderOptions() {
    let header = this.GetHeader();
    return { headers: header };
  }
}