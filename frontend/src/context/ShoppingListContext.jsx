import React, { createContext, useState, useEffect } from "react";

export const ShoppingListContext = createContext();

export function ShoppingListProvider({ children }) {
  const [shoppingLists, setShoppingLists] = useState([]);

  // Fetch shopping lists 
  useEffect(() => {
    const savedLists = JSON.parse(localStorage.getItem("shoppingLists")) || [];
    setShoppingLists(savedLists);
  }, []);

  // Add a new shopping list
  const addShoppingList = (title, items) => {
    const newList = { id: Date.now(), title, items };
    const updatedLists = [...shoppingLists, newList];
    setShoppingLists(updatedLists);
    localStorage.setItem("shoppingLists", JSON.stringify(updatedLists));
  };

  // Toggle item completion
  const toggleItemCompletion = (listId, itemIndex) => {
    const updatedLists = shoppingLists.map(list =>
      list.id === listId
        ? {
            ...list,
            items: list.items.map((item, index) =>
              index === itemIndex ? { ...item, completed: !item.completed } : item
            ),
          }
        : list
    );

    setShoppingLists(updatedLists);
    localStorage.setItem("shoppingLists", JSON.stringify(updatedLists));
  };

  // Remove item from shopping list
  const removeItem = (listId, itemIndex) => {
    const updatedLists = shoppingLists.map(list =>
      list.id === listId
        ? {
            ...list,
            items: list.items.filter((item, index) => index !== itemIndex),
          }
        : list
    );

    setShoppingLists(updatedLists);
    localStorage.setItem("shoppingLists", JSON.stringify(updatedLists));
  };

  return (
    <ShoppingListContext.Provider
      value={{ shoppingLists, addShoppingList, toggleItemCompletion, removeItem }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}
