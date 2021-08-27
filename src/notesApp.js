'use strict';

export default () => {
    const openMenu = document.getElementById('header__nav__open');
    const navBar = document.getElementById('header__nav__list');
    
    const documentClick = (e) => {
        if (e.target !== navBar) {
            navBar.classList.remove('header__nav__list--show');
            document.removeEventListener('click', documentClick);
        }
    }
    
    openMenu.addEventListener('click', (e) => {
        navBar.classList.toggle('header__nav__list--show');
        document.addEventListener('click', documentClick, true);
    });
};

