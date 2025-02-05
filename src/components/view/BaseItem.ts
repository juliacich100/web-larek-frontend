import { cloneTemplate } from "../../utils/utils";

export interface IBaseItem<T> {
    render(itemData: T): HTMLElement;
}

export abstract class BaseItem<T> implements IBaseItem<T> {
    protected element: HTMLElement;

    constructor(template: HTMLTemplateElement) {
        this.element = cloneTemplate<HTMLElement>(template);
    }

    abstract render(itemData: T): HTMLElement;
}