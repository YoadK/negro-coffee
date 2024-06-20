import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ToggleCartModal } from '../actions/cart.actions';

export interface ICartState {
  isCartModalOpen: boolean;
}

@State<ICartState>({
  name: 'cart',
  defaults: {
    isCartModalOpen: false
  }
})
@Injectable()
export class CartState {
  @Selector()
  static isCartModalOpen(state: ICartState): boolean {
    console.log('isCartModalOpen: ', state);
    return state.isCartModalOpen;
  }

  @Action(ToggleCartModal)
  toggleCartModal(ctx: StateContext<ICartState>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      isCartModalOpen: !state.isCartModalOpen
    });
    console.log('shopping cart modal state: ', state);
  }
}
