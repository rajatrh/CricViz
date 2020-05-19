import { Injectable } from '@angular/core';


const LOCALHOST_PREFIX = 'http://localhost:8081';
const PYTHON_PREFIX =  'https://cricviz-backend.uk.r.appspot.com/'

@Injectable({
  providedIn: 'root'
})
export class UrlPickerService {

  constructor() { }

  getURL(url: string) {
    if (this.isLocalhost()) {
      return LOCALHOST_PREFIX + url;
    } else {
      return PYTHON_PREFIX + url;
    }
  }

  isLocalhost() {
    if (window.location.href.includes('localhost:4200')) {
      return true;
    }
    return false;
  }
}

