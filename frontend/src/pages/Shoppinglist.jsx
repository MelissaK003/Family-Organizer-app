import React, { useState, useContext } from "react";
import { ShoppingListContext } from "../context/ShoppingListContext";

export default function Shopping() {
  const { shoppingLists, addShoppingList, toggleItemCompletion, removeItem } = useContext(ShoppingListContext);
  const [selectedList, setSelectedList] = useState(null);
  const [newListTitle, setNewListTitle] = useState("");
  const [newItems, setNewItems] = useState([{ name: "", quantity: 1 }]);

  const handleAddItem = () => {
    setNewItems([...newItems, { name: "", quantity: 1 }]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = newItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setNewItems(updatedItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newListTitle && newItems.some(item => item.name.trim() !== "")) {
      addShoppingList(newListTitle, newItems);
      setNewListTitle("");
      setNewItems([{ name: "", quantity: 1 }]);
    }
  };

  const handleRemoveItem = (listId, itemIndex) => {
    removeItem(listId, itemIndex);
  };

  return (
    <div className="p-6 bg-yellow-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Shopping Lists</h1>

      {/* Shopping List Titles */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Select a Shopping List</h2>
        {shoppingLists.length > 0 ? (
          <ul className="space-y-2">
            {shoppingLists.map((list) => (
              <li
                key={list.id}
                className="p-2 bg-yellow-500 rounded cursor-pointer hover:bg-gray-300"
                onClick={() => setSelectedList(list)}
              >
                {list.title}
              </li>
            ))}
          </ul>
        ) : (
          <p>No shopping lists available.</p>
        )}
      </div>

      {/* Display Selected Shopping List */}
      {selectedList && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{selectedList.title}</h2>
          <ul>
            {selectedList.items.map((item, index) => (
              <li key={index} className="flex justify-between items-center p-2 bg-yellow-50 rounded mb-2">
                <div>
                  <input
                    type="checkbox"
                    checked={item.completed || false}
                    onChange={() => toggleItemCompletion(selectedList.id, index)}
                    className="mr-2"
                  />
                  {item.name} - {item.quantity}
                </div>
                <button
                  onClick={() => handleRemoveItem(selectedList.id, index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add New Shopping List Form */}
      <h3 className="text-lg font-semibold mt-6 mb-2">Add a New Shopping List</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="List Title"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          required
          className="p-2 border rounded w-full"
        />

        {newItems.map((item, index) => (
          <div key={index} className="flex gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleItemChange(index, "name", e.target.value)}
              className="p-2 border rounded flex-1"
            />
            <input
              type="number"
              placeholder="Quantity"
              min="1"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
              className="p-2 border rounded w-24"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddItem}
          className="mt-4 p-2 bg-gray-100 rounded"
        >
          + Add Item
        </button>

        <button
          type="submit"
          className="w-full py-2 bg-gray-800 text-white rounded"
        >
          Save Shopping List
        </button>
      </form>
    </div>
  );
}
