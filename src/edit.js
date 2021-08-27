'use strict';

import "./styles/notes.scss";

import Notes from "./notes";
import Storage from "./storage";
import init from './notesApp';

init();

if (location.hash) {
    const id = location.hash.substring(1);
    const list = Notes.getList();
    if (list[id]) {
        const cacheChanges = (e) => {
            Storage.update('edit-cache', JSON.stringify({ id, title: titleEdit.textContent, body: bodyEdit.value, lastEdit: new Date() }));
        };

        const getCache = (note) => {
            const editCache = JSON.parse(Storage.read('edit-cache'));
            return (editCache && editCache.id === note.id && editCache.lastEdit >= note.lastEdit) ? editCache : note;
        }
        
        const titleEdit = document.getElementById('edit-note__title');
        const bodyEdit = document.getElementById('edit-note__body');
        
        
        titleEdit.addEventListener('blur', cacheChanges);
        bodyEdit.addEventListener('blur', cacheChanges);

        const values = getCache(list[id]);

        titleEdit.textContent = values.title;
        bodyEdit.value = values.body;

        document.getElementById('edit-note__save').addEventListener('click', (e) => {
            e.preventDefault();

            Notes.editNote({ title: titleEdit.textContent, body: bodyEdit.value, lastEdit: new Date(), id }, list);
            location.assign('./');
            Storage.delete('edit-cache');
        });
    }
} else {
    location.assign('./');
}