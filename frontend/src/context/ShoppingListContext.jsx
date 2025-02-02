import React, { createContext, useState, useEffect } from "react";

export const ShoppingListContext = createContext();

export function ShoppingListProvider({ children }) {
  const [shoppingLists, setShoppingLists] = useState([]);

  useEffect(() => {
    fetchShoppingLists();
  }, []);

  const fetchShoppingLists = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/shoppinglists');
      if (response.ok) {
        const data = await response.json();
      
        const transformedData = data.map(list => ({
          id: list.id,
          title: list.title,
          items: [{
            name: list.item_name,
            quantity: list.quantity,
            completed: list.checklist
          }]
        }));
        setShoppingLists(transformedData);
      }
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
    }
  };

  // Add a new shopping list
  const addShoppingList = async (title, items) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/shoppinglist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          item_names: items.map(item => item.name),
          quantity: items.map(item => item.quantity),
          user_id: 1  
        }),
      });

      if (response.ok) {
        fetchShoppingLists(); 
      }
    } catch (error) {
      console.error('Error adding shopping list:', error);
    }
  };

  // Toggle item completion
  const toggleItemCompletion = async (listId, itemIndex) => {
    try {
      const list = shoppingLists.find(l => l.id === listId);
      const item = list.items[itemIndex];

      const response = await fetch(`http://127.0.0.1:5000/shoppinglist/${listId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checklist: !item.completed
        }),
      });

      if (response.ok) {
        fetchShoppingLists(); 
      }
    } catch (error) {
      console.error('Error updating item completion:', error);
    }
  };

  // Remove item from shopping list
  const removeItem = async (listId, itemIndex) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/shoppinglist/${listId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchShoppingLists(); 
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <ShoppingListContext.Provider
      value={{ shoppingLists, addShoppingList, toggleItemCompletion, removeItem }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}