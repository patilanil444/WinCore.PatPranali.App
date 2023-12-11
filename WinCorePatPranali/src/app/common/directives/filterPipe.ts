import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(collection: any, searchValue: string): any {

    if (!searchValue) return collection;
    
    let filteredCollection = collection.filter((v:any) => v.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    return filteredCollection;
  }
}