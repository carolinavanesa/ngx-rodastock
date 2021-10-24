import {
  Component,
  OnDestroy,
  AfterViewInit,
  Output,
  EventEmitter,
  ElementRef,
  Input,
  OnChanges,
} from '@angular/core';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'ngx-tiny-mce',
  template: '',
})
export class TinyMCEComponent implements OnDestroy, AfterViewInit, OnChanges {
  @Output() editorKeyup = new EventEmitter<any>();
  @Input() initialContent = '';

  editor: any;

  constructor(
    private host: ElementRef,
    private locationStrategy: LocationStrategy
  ) {}

  ngAfterViewInit() {
    tinymce.init({
      target: this.host.nativeElement,
      plugins: ['link', 'paste', 'table'],
      skin_url: `${this.locationStrategy.getBaseHref()}assets/skins/lightgray`,
      setup: (editor) => {
        this.editor = editor;
        editor.on('keyup', () => {
          this.editorKeyup.emit(editor.getContent());
        });
      },
      height: '50%',
      width: '95%',
    });
  }

  ngOnChanges() {
    this.editor?.setContent(this.initialContent);
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }
}
