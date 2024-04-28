import { Component, ElementRef, Renderer2, ViewChild, OnInit, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrl: './child.component.scss'
})
export class ChildComponent {

  // @ViewChild('childheading') childheading!: ElementRef;
  @ViewChildren('childheading') childheading!: QueryList<any>;

  // render può essere usato per cambiare le proprietà del DOM
  constructor(private render: Renderer2) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    console.log(this.childheading);

    // ViewChild
    this.render.setStyle(this.childheading.first.nativeElement, 'background-color', 'red');
    this.render.addClass(this.childheading.last.nativeElement,"text-end");
    this.render.setStyle(this.childheading.last.nativeElement, 'background-color', 'green');
    this.render.setStyle(this.childheading.last.nativeElement, 'font-weight', 'bold');
    this.render.setStyle(this.childheading.last.nativeElement, 'color', 'white');
  }



}
