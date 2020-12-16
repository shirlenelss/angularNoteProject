import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit {
  @ViewChild('truncator') truncator: ElementRef<HTMLElement>;
  @ViewChild('bodyText') bodyText: ElementRef<HTMLElement>;
  @Input() title: string;
  @Input() body: string;
  @Input() link: string;
  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter();

  constructor(private renderer: Renderer2) { }
  ngOnInit(): void {


  }

  ngAfterViewInit(): void {

    //workout if truncator is needed otherwise hide truncate
    let style = window.getComputedStyle(this.bodyText.nativeElement, null);
    let viewableHeight = parseInt(style.getPropertyValue("height"), 10);

    if (this.bodyText.nativeElement.scrollHeight > viewableHeight) {
      //if there is a text overflow, show fade out truncator
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');

    } else {
      //hide fade out truncator
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    }
  }

  onXButtonClick(){
    this.deleteEvent.emit();
  }

}
