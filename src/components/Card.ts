import { IProduct } from "../types";
import { IPresenter } from "../types";
import { cloneTemplate } from "../utils/utils"

export interface IViewProductConstructor {
    new (template: HTMLTemplateElement, presenter: IPresenter, item: IProduct): IViewProduct;
}

interface IViewProduct {
    render(): HTMLElement;
}

export class Card implements IViewProduct {
    protected item: IProduct;
    protected itemElement: HTMLButtonElement;
    protected goodsType: HTMLElement;
    protected goodsName: HTMLElement;
    protected goodsImg: HTMLElement;
    protected goodsPrice: HTMLElement;

    constructor(template:HTMLTemplateElement, presenter: IPresenter, item: IProduct) {
        this.itemElement = cloneTemplate<HTMLButtonElement>(template);
        
        this.goodsType = this.itemElement.querySelector(".card__category");
        this.goodsName = this.itemElement.querySelector(".card__title");
        this.goodsImg = this.itemElement.querySelector(".card__image");
        this.goodsPrice = this.itemElement.querySelector(".card__price");
        this.item = item;

        this.itemElement.addEventListener('click', () => {
            this.handleClick(presenter);
        });
    }

    protected handleClick(presenter: IPresenter) {
        presenter.openPreview(this.item);
    }

    set category(value:string) {
        this.goodsType.textContent = value;
    }

    get category(): string {
        return this.goodsType.textContent || '';
    }

    set title(value:string) {
        this.goodsName.textContent = value;
    }

    get title(): string {
        return this.goodsName.textContent || '';
    }

    set img(value:string) {
        this.goodsImg.setAttribute('src', value);
    }

    set price(value:number | null) {
        if(value === null) {
            this.goodsPrice.textContent = `Бесценно`;
        } else if (typeof value === 'number') {
            this.goodsPrice.textContent = `${String(value)} синапсов`;
        }       
    }

    get price(): number | null {
        return Number(this.goodsPrice.textContent) || null;
    }

    render() {
        this.category = this.item.category;
        this.title = this.item.title;
        this.img = this.item.image;
        this.price = this.item.price;
        return this.itemElement;
    }
}