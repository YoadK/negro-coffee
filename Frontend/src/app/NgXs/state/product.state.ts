import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ProductModel } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { UpdateProductQuantity, AddProduct, UpdateProduct, DeleteProduct } from '../actions/product.actions';


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

    constructor(private productsService: ProductsService) { } // Inject ProductsService


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

    @Action(AddProduct)
    addProduct(ctx: StateContext<IProductState>, action: AddProduct) {
        const state = ctx.getState();
        const newProduct = action.payload;

        ctx.patchState({
            products: {
                ...state.products,
                [newProduct._id.toString()]: {
                    ...newProduct,
                    quantity: newProduct.product_weight_grams
                }
            }
        });
    }

    @Action(UpdateProduct)
    updateProduct(ctx: StateContext<IProductState>, action: UpdateProduct) {
        const state = ctx.getState();
        const updatedProduct = action.payload;

        ctx.patchState({
            products: {
                ...state.products,
                [updatedProduct._id.toString()]: {
                    ...updatedProduct,
                    quantity: updatedProduct.product_weight_grams
                }
            }
        });
    }

    @Action(DeleteProduct)
    deleteProduct(ctx: StateContext<IProductState>, action: DeleteProduct) {
        const state = ctx.getState();
        const { [action.payload]: removed, ...rest } = state.products;

        ctx.setState({
            products: rest
        });
    }
}//class ProductState END