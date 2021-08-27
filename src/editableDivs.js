'use strict';

// .editable {
//   position: relative;
//   width: 100%;
// }
// .editable__element--click-through {
//   position: absolute;
//   top: 0;
//   pointer-events: none;
//   color: var(--primary-light-1);
// }
export default class EditableDivs {
    defaultText = 'Edit Text';
    constructor(parentID, defaultText, foregroundText = '') {
        this.parentID = document.getElementById(parentID);
        this.parentID.classList.add(`editable`);
        this.parentID.style = "position: relative; width: 100%";
        this.defaultText = defaultText;

        console.log(this.parentID);
        // this.foreground = this.parentID.appendChild(document.createElement('p'));
        // this.foreground.id = `${parentID}--foreground`;
        // this.foreground.setAttribute('contenteditable', '');
        // this.foreground.tabIndex = this.parentID.tabIndex; 
        // this.foreground.removeAttribute('tabindex');
        
        this.background = this.parentID.appendChild(document.createElement('p'));
        this.background.id = `${parentID}--background`;
        this.background.classList.add(`editable__element--click-through`);
        this.background.style = "position: absolute; top: 0; pointer-events: none; color: grey;";

        this.foreground.innerHTML = foregroundText;

        if (!foregroundText) {
            this.background.innerHTML = defaultText;
        }

        this.#init();
    }

    #init() {
        this.foreground.oninput = (e) => {
            this.background.innerHTML = (e.target.textContent.trim()) ? '' : this.defaultText
        };
        this.foreground.onkeypress = (e) => {
            // console.log(e);
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        };
    }

    get value() {
        return this.foreground.innerText;
    }
    set value(arg) {
        if (typeof arg !== 'object') {
            this.foreground.innerText = arg;
        }
    }

    /**
     * **focus**: Gives the foreground layer of the editable div focus.
     */
    focus() {
        this.foreground.focus();
    }

    /**
     * **blur**: Removes focus from the foreground layer.
     */
    blur() {
        this.foreground.blut();
    }

    /**
     * **reset**: Resets the value inside of the div's editable section to nothing and the background
     * to the default text value and returns the previous value.
     * @returns The previous value
     */
    reset() {
        const oldValue = this.foreground.innerHTML;
        this.foreground.innerHTML = '';
        this.background.innerHTML = this.defaultText;
        return oldValue;
    }
}