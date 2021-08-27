'use strict';

import "./styles/notes.scss";

import Notes from './notes';
import init from './notesApp';

if (!'content' in document.createElement('template')) {
    throw new Error("Your browser doesn't support HTML Templates. Try updating or using a differnet browser.");
}

const notesList = new Notes(document.getElementById('notes-list'), document.getElementById('search').value, document.getElementById('sort').value);
init();

document.getElementById('search').addEventListener('input', (e) => notesList.setSearch(e.target.value));
document.getElementById('sort').addEventListener('change', (e) => notesList.sortList(e.target.value));

const create = {
    title: document.getElementById('add-note__title'),
    body: document.getElementById('add-note__body')
};

for (let editable of document.querySelectorAll('.editable')) {
    editable.addEventListener('blur', e =>  {
        e.target.innerHTML = e.target.innerText.trim();
    })
}

document.getElementById('add-note__action').addEventListener('mouseup', (e) => {
    e.preventDefault();
    if (create.title.textContent) {
        notesList.addNote(create.title.textContent, create.body.value);
        create.title.textContent = '';
        create.body.value = '';
    }
});