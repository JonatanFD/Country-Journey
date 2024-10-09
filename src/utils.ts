export const $ = (selector: string) => {
    return document.querySelector(selector);
};

export const $$ = (selector: string) => {
    return document.querySelectorAll(selector);
};

export const $id = (id: string) => {
    return document.getElementById(id);
};
