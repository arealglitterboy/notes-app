'use strict';

class NoteNode {
    constructor(title, body, id, lastEdit) {
        this.title = title;
        this.body = body;
        this.id = id;
        this.lastEdit = lastEdit;
    }

    toJSON = () => ({ title: this.title, body: this.body, lastEdit: this.lastEdit, id: this.id });
}

export default class Note extends NoteNode {
    static template = document.getElementById('note-template').content.children[0];

    /**
     * 
     * @param {string} title 
     * @param {string} body 
     * @param {Date} lastEdit 
     * @param {*} id 
     * @param {(event) => {}} handleAction 
     */
    constructor(title, body, id, handleAction, lastEdit = new Date()) {
        super(title, body, id, lastEdit);

        this.note = Note.template.cloneNode(true);
        
        this.note.heading = this.note.querySelector('.note__title');
        this.note.body = this.note.querySelector('.note__body');
        this.note.lastEdit = this.note.querySelector('.note__last-edit');
        this.note.action = this.note.querySelector('.note__action');
        this.note.actions = this.note.querySelector('.note__actions');

        const documentClick = (e) => {
            if (e.target !== this.note.action && e.target !== this.note.actions) {
                this.note.actions.classList.remove('note__actions--show');
                document.removeEventListener('click', documentClick);
            }
        }

        this.note.action.addEventListener('click', (e) => {
            this.note.actions.classList.add('note__actions--show');
            document.addEventListener('click', documentClick);
        });

        this.note.querySelector('.remove').addEventListener('mouseup', handleAction);
        this.note.querySelector('.edit').addEventListener('mouseup', (e) => {
            location.assign(`./edit.html#${id}`);
        });

        this.note.action.textContent = "⋯";

        this.updateHtml();
        this.note.id = id;
    }

    updateHtml = () => {
        this.note.heading.textContent = this.title;
        this.note.body.textContent = this.body;

        this.note.lastEdit.textContent = this.time;
        this.note.lastEdit.setAttribute('datetime', this.lastEdit.toISOString());
    }

    get time() {
        return this.lastEdit.toLocaleDateString('en-IE', { weekday: 'long', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    /**
     * **getHtml**: returns the html node associated with this note, along with adding a `<mark>` tag around any text matching the search term (if any).
     * @param {RegExp} search 
     * @returns 
     */
    getHtml(search) {
        this.note.heading.innerHTML = (search) ? this.title.replace(search, `<mark>$&</mark>`) : this.title;
        
        return this.note;
    }

    static fromJSON = ({ title, body, id, lastEdit }, handlers) => (new Note(title, body, id, handlers, new Date(lastEdit)));
}