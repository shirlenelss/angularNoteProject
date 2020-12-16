import { Injectable } from '@angular/core';
import { Note } from './note.module';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  notes: Note[] = new Array<Note>();

  constructor() { }

  get(id: number) {
    return this.notes[id];
  }

  getAll() {
    return this.notes;
  }

  getId(note:Note) {
    return this.notes.indexOf(note);
  }

  add(note: Note) {
    let newLength = this.notes.push(note);
    let index = newLength -1;
    return index;
  }

  update(id: number, title:string, body: string) {
    let note = this.get(id);
    note.title = title;
    note.body  = body;

  }

  delete(id) {
    this.notes.splice(id, 1);
  }
}
