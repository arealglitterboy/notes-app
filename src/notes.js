'use strict';

import { v4 as uuidv4 } from 'uuid';

import Storage from './storage';
import Note from "./note";

export default class Notes {
    constructor(main, search = "", sort = "oldest") {
        this.list = {};
        this.main = main;
        
        this.readStorage();
        
        this.search = search;
        
        this.sort = this.getSort(sort);
        this.sortName = document.getElementById('sort');
        
        this.empty = document.createElement('p');
        this.empty.classList.add('notes__empty');
        
        this.sortList(sort);
        this.render();
    }

    // #region Notes List methods
    addNote = (title, body) => {
        const id = uuidv4();
        this.list = { ...this.list, [id]: new Note(title, body, id, this.createHandlers(id)) };
        this.sortList(this.sortName.value);
        this.render();
        this.updateStorage();
    }

    createHandlers = (id) => (this.removeHandle(id));
  
    removeHandle = (id) => (() => (this.removeNote(id)));

    static removeNote = (id, list) => {
        const { [id]: remove, ...rest } = list;
        if (remove) {
            Notes.storeList(rest);
        }
        return rest;
    }

    removeNote = (id) => {
        this.list = Notes.removeNote(id, this.list);
        this.render();
    };

    static updateNote = (id, title, body, list) => {
        const { [id]: previous } = list;
        if (previous) {
            previous.update(title, body);
        }
        Notes.storeList(list);
    }

    updateNote = (id, title, body) => {
        Notes.updateNote(id, title, body, this.list);
        this.render(); // ? IDK if this is right
    }
    // #endregion

    // #region visual methods
    render = () => {
        const html = this.getListHTML();

        if (html.length > 0) {
            this.main.replaceChildren(...html);
        } else {
            this.main.replaceChildren();
        }
    };

    getListHTML = () => {
        let list = Object.values(this.list);
        let search;

        if (this.search.length > 0) {
            console.log('searching', this.search);
            search = new RegExp(`${this.search}`, 'gi');
            list = list.filter(({ title }) => (title.search(search) >= 0)); // * Return a list of notes which match the search
        }

        return list.map((note) => note.getHtml(search));
    };

    get emptyMessage() {
        this.empty.textContent = `It's pretty lonely here :(`;
        return this.empty;
    }

    getSort(sortName) {
        switch(sortName) {
            case 'newest':
                return ([, control], [, compare]) => (control.lastEdit < compare.lastEdit);
            case 'oldest':
                return ([, control], [, compare]) => (control.lastEdit > compare.lastEdit);
            case 'alpha-desc':
                return ([, control], [, compare]) => (control.title.localeCompare(compare.title, 'en', { sensitivity: 'base' }));
            case 'alpha-asc':
                return ([, control], [, compare]) => (compare.title.localeCompare(control.title, 'en', { sensitivity: 'base' }));
            default:
                throw new Error('Invalid sort name passed to sort getter method.');
        }
    }

    sortList = (sortName) => {
        if (sortName) {
            this.sort = this.getSort(sortName);
        }
        const list = Object.fromEntries(Object.entries(this.list).sort(this.sort));
        this.list = list;
        this.render();
    }
    
    /**
     * 
     * @param {string} search 
     */
    setSearch = (search) => {
        console.log(search);
        this.search = search;
        // this.search = search.escapeRegex();
        this.render();
    }

    // #endregion

    // #region storage
    static storeList = (list) => {
        Storage.create('notes', JSON.stringify({ ...list }));
    };

    updateStorage = () => {
        Storage.create('notes', JSON.stringify({ ...this.list }));
    };

    readStorage = () => {
        const stored = JSON.parse(Storage.read('notes'));
        const list = {};
        if (stored) {
            for (let [key, value] of Object.entries(stored)) {
                list[key] = this.fromJSON(value);
            }
        }
        this.list = list;
    }

    static findNote = (id, list = this.getList()) =>  ((list) ? list[id] : undefined);

    static getList = () => (JSON.parse(Storage.read('notes')));

    static editNote = (note, list = this.getList()) => {
        if (list[note.id]) {
            list[note.id] = note;
            this.storeList(list);
        }
    };

    fromJSON = (note) =>  Note.fromJSON(note, this.createHandlers(note.id));
    // #endregion
}