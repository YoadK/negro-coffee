import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ToggleCartModal, AddToCart, RemoveFromCart, UpdateCartItemQuantity, LoadUserCart } from '../actions/cart.actions';
import { ObjectId } from 'mongoose';
import { ProductModel } from '../../models/product.model';
import { ClearCart } from '../actions/cart.actions';
import { Select, Store } from '@ngxs/store';
import { AuthState } from './auth.state';

export interface ICartState {
    isCartModalOpen: boolean;
    items: Array<ProductModel & { quantity: number }>;
    totalQuantity: number;
    totalPrice: number;
}



@State<ICartState>({
    name: 'cart',
    defaults: {
        isCartModalOpen: false,
        items: [],
        totalQuantity: 0,
        totalPrice: 0
    }
})

@Injectable()
export class CartState {

    constructor(private store: Store) { }

    // setting  'saveCartState' and 'loadCartState' functions  to include the user's ID:
private saveCartState(state: ICartState, userId: string) {
    localStorage.setItem(`cartState_${userId}`, JSON.stringify(state));
}

private loadCartState(userId: string): ICartState {
    const savedState = localStorage.getItem(`cartState_${userId}`);
    return savedState ? JSON.parse(savedState) : { isCartModalOpen: false, items: [], totalQuantity: 0, totalPrice: 0 };
}


    //Selectors

    @Selector()
    static isCartModalOpen(state: ICartState): boolean {
        console.log('isCartModalOpen: ', state);
        return state.isCartModalOpen;
    }

    @Selector()
    static cartItems(state: ICartState): Array<ProductModel & { quantity: number }> {
        return state.items;
    }

    @Selector()
    static cartItemsCount(state: ICartState): number {
        return state.items.reduce((count, item) => count + item.quantity, 0);
    }

    @Selector()
    static cartTotal(state: ICartState): number {
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }


    //Actions

    @Action(ToggleCartModal)
    toggleCartModal(ctx: StateContext<ICartState>) {
        const state = ctx.getState();
        const newIsCartModalOpen = !state.isCartModalOpen;
        ctx.patchState({ isCartModalOpen: newIsCartModalOpen });
        const userId = this.store.selectSnapshot(AuthState.user)?._id || '';
        this.saveCartState(ctx.getState(), userId);
        
        if (newIsCartModalOpen) {
            console.log('The shopping cart modal is opened.');
        } else {
            console.log('The shopping cart modal is closed.');
        }
    }

    @Action(AddToCart)
    addToCart(ctx: StateContext<ICartState>, action: AddToCart) {
        const state = ctx.getState();
        const existingItemIndex = state.items.findIndex(item => item._id === action.payload.product._id);

        if (existingItemIndex !== -1) {
            const updatedItems = state.items.map((item, index) =>
                index === existingItemIndex
                    ? { ...item, quantity: item.quantity + action.payload.quantity }
                    : item
            );
            ctx.patchState({ items: updatedItems });
        } else {
            const newItem = { ...action.payload.product, quantity: action.payload.quantity };
            ctx.patchState({ items: [...state.items, newItem] });
        }
        const userId = this.store.selectSnapshot(AuthState.user)?._id?.toString() || '';
        this.saveCartState(ctx.getState(), userId);
    }

    @Action(RemoveFromCart)
    removeFromCart(ctx: StateContext<ICartState>, action: RemoveFromCart) {
        const state = ctx.getState();
        const updatedItems = state.items.filter(item => item._id !== action.payload.productId);
        ctx.patchState({ items: updatedItems });
        const userId = this.store.selectSnapshot(AuthState.user)?.email || '';
        this.saveCartState(ctx.getState(), userId);
    }

    @Action(UpdateCartItemQuantity)
    updateCartItemQuantity(ctx: StateContext<ICartState>, action: UpdateCartItemQuantity) {
        const state = ctx.getState();
        const updatedItems = state.items.map(item =>
            item._id === action.payload.productId
                ? { ...item, quantity: action.payload.quantity }
                : item
        );
        ctx.patchState({ items: updatedItems });
        const userId = this.store.selectSnapshot(AuthState.user)?.email || '';
        this.saveCartState(ctx.getState(), userId);;
    }

    @Action(ClearCart)
    clearCart(ctx: StateContext<ICartState>) {
        ctx.setState({
            isCartModalOpen: false,
            items: [],
            totalQuantity: 0,
            totalPrice: 0
        });
        const userId = this.store.selectSnapshot(AuthState.user)?.email || '';
        this.saveCartState(ctx.getState(), userId);
    }

    @Action(LoadUserCart)
    loadUserCart(ctx: StateContext<ICartState>, action: LoadUserCart) {
        const userCart = this.loadCartState(action.userId);
        ctx.setState(userCart);
    }

}