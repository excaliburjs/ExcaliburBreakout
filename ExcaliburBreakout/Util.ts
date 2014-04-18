/**
* Whether or not an element has a CSS class present
* @param element The DOM element to check
* @param cls The CSS class to check for
* @returns True if the class exists and false if not
*/
function hasClass(element: HTMLElement, cls: string): boolean {
    return element.classList.contains(cls);
}

/**
* Replaces a CSS class on an element
* @param element The DOM element to manipulate
* @param search The CSS class to find
* @param replace The CSS class to replace with
*/
function replaceClass(element: HTMLElement, search: string, replace: string): void {

    if (hasClass(element, search)) {
        this.removeClass(element, search);
        this.addClass(element, replace);
    }

}

/**
    * Adds a CSS class to a DOM element
    * @param element The DOM element to manipulate
    * @param cls The CSS class to add
    */
function addClass(element: HTMLElement, cls: string): void {
    element.classList.add(cls);
}

/**
 * Removes a CSS class to a DOM element
 * @param element The DOM element to manipulate
 * @param cls The CSS class to remove
 */
function removeClass(element: HTMLElement, cls: string): void {
    element.classList.remove(cls);
}

function setVolume(val: number) {
    Resources.Bounce.setVolume(val);
    Resources.Explode.setVolume(val);
    Resources.Fail.setVolume(val);
}