import { Popup } from "../components/Popup";
import { IPage } from "../components/Page";
import { IViewProductConstructor } from "../components/Card"
import { IPaymentForm } from "../components/PaymentForm";
import { IBasket } from "../components/Basket";
import { IContactsForm } from "../components/ContactsForm";
import { ISuccessForm } from "../components/SuccessForm";
import { IServer } from "../components/ServerApi";
import { IPreview } from "../components/Preview";

export interface IModel {
    _items: IProduct[];
    order: IServerOrder;

    getItem(id:string): IProduct | null;
    getOrder(): IServerOrder;
    getOrderItems(): IProduct[];
    findPricelessItem(): boolean;
    setPayment(value: string): void;
    setAddress(value: string): void;
    setEmail(email: string): void;
    setPhone(phone: string): void;
    validateAddress(): string | null;
    validateContacts(): string | null;
    deletePricelessFromOrder(): void;
    countTotal(): number;
    saveTotal(): void;
    clearOrderContacts(): void;
}

export interface IProduct {
    id: string;
    category: string;
    title: string;
    image: string;
    description: string;
    price: number;
}

export type TBasketItem = Pick<IProduct, 'id' | 'title' | 'price'> & {index: number;}

export interface IProductsServerList {
    total: number;
    items: IProduct[];
}

export interface IServerOrder {
    payment: "card" | "cash";
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[] | null;

    addItem(id: string): void;
    getItem(id: string): string | null;
    deleteItem(id: string): void;
    setTotal(total: number): void;
    setPayment(value: string): void;
    setAddress(value: string): void;
    setEmail(value: string): void;
    setPhone(value: string): void;
    getAddress(): string | null;
    getEmail(): string | null;
    getPhone(): string | null;
    clearContacts(): void;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IPresenter {
    renderView(): void;
    getCardData(id: string): IProduct | null;
    getItemFromOrder(id: string): string;
    getOrderItemsData(): IProduct[];
    openPreview(item: IProduct): void;
    openBasket(): void;
    addItemToBasket(itemId: string): void;
    deleteItemFromBasket(itemId: string): void;
    hasOnlyPricelessItem(): boolean;
    openPaymentForm(): void;
    openContactsForm(): void;
    closeSuccessPopup(): void;
    setPaymentMethod(value: string): void;
    setAddressToForm(address: string): void;
    pay(): void;
    setEmail(email: string): void;
    setPhone(phone: string): void;
    getAddressError(): string | null;
    getContactError(): string;
}

export type TPresenterParams = {
    server: IServer;
    model: IModel,
    viewPageContainer: IPage,
    viewItemConstructor: IViewProductConstructor,
    preview: IPreview,
    popup: Popup,
    basket: IBasket,
    paymentForm: IPaymentForm,
    contactsForm: IContactsForm,
    successPopup: ISuccessForm,
    imageUrl: string
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

