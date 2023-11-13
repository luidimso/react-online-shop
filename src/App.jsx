import { useState, useReducer } from 'react';

import Header from './components/Header.jsx';
import Shop from './components/Shop.jsx';
import { DUMMY_PRODUCTS } from './dummy-products.js';
import Product from './components/Product.jsx';
import { CartContext } from './store/shopping-cart-context.jsx';

function shoppingCartReducer(state, action) {
  if(action.type == "ADD_ITEM") {
    const updatedItems = [...state.items];

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === action.payload
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
        updatedItems.push({
          id: action.payload,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
        items: updatedItems,
      };
  } 
  
  if(action.type == "UPDATE_ITEM") {
    const updatedItems = [...state.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === action.productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += action.amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        items: updatedItems,
      };
  }

  return state;
}

function App() {
  const [shoppingCartState, shoppingCartDispatch] = useReducer(shoppingCartReducer, {items: []});

  // These methods are passed as values as initial context value for be shared as provider, so all the components thats uses that context as provider, can use those mathods

  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type: "ADD_ITEM",
      payload: id
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: "UPDATE_ITEM",
      productId: productId,
      amount: amount
    });
  }

  const contextValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity
  };

  return (
    <CartContext.Provider value={contextValue}>
      <Header />
      <Shop >
        {DUMMY_PRODUCTS.map((product) => (
          <li key={product.id}>
            <Product {...product} />
          </li>
        ))} 
      </Shop>
    </CartContext.Provider>
  );
}

export default App;
