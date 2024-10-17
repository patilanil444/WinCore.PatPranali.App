import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export class GlobleDeclarations
{
  static apiBaseURL = environment.apiBaseURL;
  //static apiBaseURL = "http://localhost:5668/";
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