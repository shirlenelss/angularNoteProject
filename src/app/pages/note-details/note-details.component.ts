import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router , Params } from '@angular/router';
import { Note } from 'src/app/shared/note.module';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {

  note: Note;
  noteId: number;
  new :boolean;

  constructor(private noteService: NotesService, private router:Router
    , private route: ActivatedRoute ) {
    this.noteService = noteService;
  }


  ngOnInit(): void {
    // find out if new or edit
    this.route.params.subscribe((params: Params) => {
      this.note = new Note();
      if (params.id) {
        this.note = this.noteService.get(params.id);
        this.noteId = params.id;
        this.new = false;
      } else {
        this.new = true;
      }

    })


  }

  onSubmit(form: NgForm){
    //save the note
    if (this.new) {
      this.noteService.add(form.value);
    } else {
      this.noteService.update(this.noteId, form.value.title, form.value.body);
    }
    this.router.navigateByUrl('/');


  }

  cancel(){
    this.router.navigateByUrl('/');
  }

}
