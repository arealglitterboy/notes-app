'use strict';

import Note from "./note";

export default class EditableNote extends Note {
    constructor(title, body, id, handleSave) {
        super('', '', new Date(), id, handleSave);
        
        // Treat title.textContent as the foreground layer, update it on change in the hidden background layer.
        // Use 
        this.defaultTitle = title;
        this.defaultBody = body;
        this.note.action.textContent = "Save";
        this.note.header.textContent = '';

        this.note.headerBG = document.createElement('div');
        this.note.header.parentNode.appendChild(this.note.headerBG);
        this.note.headerBG.classList.add('note__editable note__editable--header');
        this.note.headerBG.textContent = title;

        this.note.headerBG.setAttribute('contenteditable', true);
        this.note.headerBG.addEventListener('input', (e) => {
            console.log(e);
        });
    }

    createEditable = (parentElement, target, defaultText) => {
        const editable = document.createElement('div');
        parentElement.appendChild(editable);
        editable.classList.add('note__editable', this.note[target].className);
        editable.setAttribute('contenteditable', true);
        editable.addEventListener('focus', (e) => {
            if (!this.note[target].textContent.trim()) {
                editable.textContent = '';
            }
        });
        editable.addEventListener('blur', (e) => {
            if (!this.note[target].textContent.trim()) {
                editable.textContent = defaultText;
            }
        });
        editable.addEventListener('change', (e) => {
            console.log('Editable change,',target,e);
            this[target] = e.target.textContent;
        });
    };

    saveCallback = () => {};

    getHtml(search) {
        return super.getHtml();
    }

    // updateHtml = () => {
    //     super.updateHtml();
    //     this.note.title.innerHTML = '';
    // };
    
    update({ title, body }) {
        if (title || body) {
            this.lastEdit = new Date();
            if (title) {
                this.title = title;
            }
            if (body) {
                this.body = body;
            }
        }
        // Update the instance variables
        // Afterwards, the notes list would simply update the html notes list and update the stored list.
    }

    static fromStorage = (id) => {
        // get the list from storage
        // pull the specific id
        // special return for if it's not found?
    };
}