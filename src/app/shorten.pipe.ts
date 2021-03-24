import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten',
  pure: true,
})
export class ShortenPipe implements PipeTransform {

  transform(value: string, length: number = 40): unknown {
    return `${value?.substr(0, length)}...`;
  }

}
