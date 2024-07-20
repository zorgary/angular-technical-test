import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'divideByTwo',
  standalone: true
})
export class DivideByTwoPipe implements PipeTransform {

  transform(value: number): number {
    return value / 2;
  }

}