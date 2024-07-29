import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ProductModel } from '../../models/product.model';
import { UpdateProductQuantity } from '../actions/product.actions';

export interface IProductState {
    products: { [id: string]: ProductModel & { quantity: number } };
}

@State<IProductState>({
    name: 'products',
    defaults: {
        products: {}
    }
})

@Injectable()
export class ProductState {
    @Selector()
    static getProducts(state: IProductState) {
        return Object.values(state.products);
    }

    @Action(UpdateProductQuantity)
    updateProductQuantity(ctx: StateContext<IProductState>, action: UpdateProductQuantity) {
        const state = ctx.getState();
        const { productId, quantity } = action.payload;
        
        ctx.patchState({
            products: {
                ...state.products,
                [productId.toString()]: {
                    ...state.products[productId.toString()],
                    quantity: quantity
                }
            }
        });
    }
}