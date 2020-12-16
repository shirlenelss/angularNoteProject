import {
  animate,
  style,
  transition,
  trigger,
  query,
  stagger,
} from '@angular/animations';
import { Component, ElementRef, OnInit, Optional, ViewChild } from '@angular/core';
import { Note } from 'src/app/shared/note.module';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [
    trigger(
      'itemAnim',
      //animation
      [
        transition('void => *', [
          //set initial state
          style({
            height: 0,
            opacity: 0,
            transform: 'scale(0.85)',
            'margin-bottom': 0,

            //we have to expand out padding properties to cover firefox error
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
          }),
          //animate spacing
          animate(
            '50ms',
            style({
              height: '*',
              'margin-bottom': '*',
              paddingTop: '*',
              paddingBottom: '*',
              paddingLeft: '*',
              paddingRight: '*',
            })
          ),
          animate(70),
        ]),
        transition('* => void', [
          //first scale up
          animate(
            50,
            style({
              transform: 'scale(1.05)',
            })
          ),
          //then scale down to original size while fading out
          animate(
            50,
            style({
              transform: 'scale(1)',
              opacity: 0.75,
            })
          ),
          //scale down and fade completely
          animate(
            '120ms ease-out',
            style({
              transform: 'scale(0.68)',
              opacity: 0,
            })
          ),
          //then animate spacing
          animate(
            '150ms ease-out',
            style({
              height: 0,
              paddingTop: 0,
              paddingBottom: 0,
              paddingLeft: 0,
              paddingRight: 0,
              'margin-bottom': 0,
            })
          ),
        ]),
      ]
    ),
    trigger('listAnim', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({
              opacity: 0,
              height: 0,
            }),
            stagger(100, [animate('0.2s ease')]),
          ],
          {
            optional: true,
          }
        ),
      ]),
    ]),
  ],
})
export class NotesListComponent implements OnInit {
  notes: Note[] = new Array<Note>();

  filteredNotes: Note[] = new Array<Note>();

  @ViewChild('filterInput') filterInputEleRef: ElementRef<HTMLInputElement>;

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    //retrieve all notes
    this.notes = this.notesService.getAll();
    //this.filteredNotes = this.notesService.getAll();
    this.filter('');
  }

  deleteNote(note: Note) {
    let id = this.notesService.getId(note)
    this.notesService.delete(id);
    this.filter(this.filterInputEleRef.nativeElement.value);
  }

  generateNoteUrl(note: Note) {
    let id = this.notesService.getId(note)
    return id;

  }

  filter(query: string) {
    query = query.toLowerCase().trim();
    let allResults: Note[] = new Array<Note>();

    let terms: string[] = query.split(' ');
    terms = this.removeDupicates(terms);
    //compile all relevant results into the allResults array
    terms.forEach(word => {
      let results = this.relevantNotes(word);
      //append to allResults
      allResults = [...allResults, ...results]
    });

    let uniqueResults = this.removeDupicates(allResults);
    this.filteredNotes = uniqueResults

    this.sortByRelevancy(allResults);
  }

  removeDupicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    //use Set becos A value in the Set may only occur once
    arr.forEach((e) => uniqueResults.add(e));

    return Array.from(uniqueResults);
  }

  relevantNotes(query: string): Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter(note => {
      if (note.body && note.body.toLowerCase().includes(query)) {
        return true;
      }
      if (note.title && note.title.toLowerCase().includes(query)) {
        return true;
      }
      return false;
    });
    return relevantNotes;
  }

  sortByRelevancy(searchRsults: Note[]) {
      //sort bu number of times it appears in search results

      let noteCountObj: Object = {} //format = key:value => NoteId:number (note object id: count)
      searchRsults.forEach(note => {
        let noteId = this.notesService.getId(note);
        if (noteCountObj[noteId]) {
          noteCountObj[noteId] += 1
        } else {
          noteCountObj[noteId] = 1
        }
      });
      this.filteredNotes = this.filteredNotes.sort((a:Note, b: Note) => {
        let aId = this.notesService.getId(a);
        let bId = this.notesService.getId(b);

        let aCount = noteCountObj[aId];
        let bCount = noteCountObj[bId];
        return bCount - aCount;  //descending count order
      });
  }
}
