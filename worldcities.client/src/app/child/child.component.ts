import { Component, ElementRef, Renderer2, ViewChild, OnInit } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrl: './child.component.scss'
})
export class ChildComponent {

  @ViewChild('childheading') childheading!: ElementRef;

  // render può essere usato per cambiare le proprietà del DOM
  constructor(private render: Renderer2) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    console.log(this.childheading);

    // ViewChild
    this.render.setStyle(this.childheading.nativeElement, 'background-color', 'red');
  }

}
