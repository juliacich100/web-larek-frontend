import { IProductsServerList, IServerOrder, IApi, IOrderResult} from "../types";

export interface IServer {
    sendOrder(data: IServerOrder): Promise<IOrderResult>;
    getProductList(): Promise<IProductsServerList>;
}

export class ServerApi implements IServer {
    private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

    getProductList(): Promise<IProductsServerList> {
        return this._baseApi.get<IProductsServerList>(`/product/`).then((products: IProductsServerList) => products);
    }

    sendOrder(data: IServerOrder): Promise<IOrderResult> {
		return this._baseApi.post<IOrderResult>(`/order`, data).then((data: IOrderResult) => data);
    };
}