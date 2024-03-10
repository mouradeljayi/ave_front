import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'empty'
})
export class EmptyPipe implements PipeTransform {

  transform(value: string | undefined, ...args: unknown[]): string {
    if(value){
      if(value.length > 20 ){
        return value.slice(0,15) + ' ...'
      }else{
        return value;
      }
    }else{
      return 'N/A';
    }
  }

}
