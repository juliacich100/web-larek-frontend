import { Popup } from "../components/view/Popup";
import { IPage } from "../components/view/Page";
import { ICardConstructor } from "../components/view/Card"
import { IPaymentForm } from "../components/view/PaymentForm";
import { IBasket } from "../components/view/Basket";
import { IContactsForm } from "../components/view/ContactsForm";
import { ISuccessForm } from "../components/view/SuccessForm";
import { IServer } from "../components/ServerApi";
import { IPreview } from "../components/view/Preview";

export interface IProduct {
    id: string;
    category: string;
    title: string;
    image: string;
    description: string;
    price: number | null;
}

export type TBasketItem = Pick<IProduct, 'id' | 'title' | 'price'> & {index: number;}

export interface IProductsServerList {
    total: number;
    items: IProduct[];
}

export interface IServerOrder {
    payment: "online" | "offline";
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[] | null;
}

export interface IProductsModel {
    items: IProduct[];
    getProduct(id:string): IProduct | null;
    findPricelessProduct(orderItems: string[]): string | null;
    countTotal(orderItems: IProduct[]): number;
}

export interface IOrderModel {
    order: IServerOrder;
    addItem(id: string): void;
    getItem(id: string): string | null;
    deleteItem(id: string): void;
    getOrder(): IServerOrder;
    getOrderItems(): string[];
    setTotal(total: number): void;
    setPayment(value: string): void;
    setAddress(value: string): void;
    setEmail(value: string): void;
    setPhone(value: string): void;
    validateAddress(): string | null;
    validateContacts(): string | null;
    clearOrderFields(): void;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IPresenter {
    renderProductsList(): void;
    renderBasketItems(): void;
    handleOrderButtonClick(id: string): void;
    openPreview(item: IProduct): void;
    openBasket(): void;
    openPaymentForm(): void;
    openContactsForm(): void;
    openSuccessPopup(total: number): void;
    closeSuccessPopup(): void;
    pay(): void;
    handleContactsInputChange(email: string, phone: string): void;
    handleAdressInputChange(payment: string, adress: string): void;
}

export type TPresenterParams = {
    server: IServer;
    itemModel: IProductsModel,
    orderModel: IOrderModel,
    viewPageContainer: IPage,
    viewItemConstructor: ICardConstructor,
    preview: IPreview<IProduct>,
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

