import React, { useState, useContext } from 'react';
import { MealPlanContext } from '../context/MealPlanContext';

export default function MealPlan() {
    const { mealPlans, addMealPlan, deleteMealPlan } = useContext(MealPlanContext);
    const [newMeal, setNewMeal] = useState({ day: '', description: '', tag: '' });

    const handleAddMeal = (e) => {
        e.preventDefault();
        addMealPlan(newMeal.tag, newMeal.description, newMeal.day);
        setNewMeal({ day: '', description: '', tag: '' }); // Reset form
    };

    // Group meal plans by day
    const getMealsByDay = () => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return days.map(day => ({
            day,
            meals: mealPlans.filter(meal => meal.day === day)
        }));
    };

    return (
        <div className="p-6 bg-white text-black rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-4 text-black-500">Weekly Meal Plan</h1>
            <table className="min-w-full border-collapse border border-yellow-500">
                <thead>
                    <tr className="bg-yellow-500">
                        <th className="border border-yellow-500 p-2">Day</th>
                        <th className="border border-yellow-500 p-2">Breakfast</th>
                        <th className="border border-yellow-500 p-2">Lunch</th>
                        <th className="border border-yellow-500 p-2">Supper</th>
                    </tr>
                </thead>
                <tbody>
                    {getMealsByDay().map(({ day, meals }) => (
                        <tr key={day} className="bg-white hover:bg-gray-100">
                            <td className="border border-yellow-500 p-2 text-black">{day}</td>
                            {['breakfast', 'lunch', 'supper'].map(mealType => (
                                <td key={mealType} className="border border-yellow-500 p-2 text-center text-black">
                                    {meals.find(meal => meal.tag === mealType)?.description || ''}
                                    {meals.find(meal => meal.tag === mealType) && (
                                        <button 
                                            onClick={() => deleteMealPlan(meals.find(meal => meal.tag === mealType).id)}
                                            className="ml-2 text-red-500 text-xl"
                                        >
                                            &times; {/*  delete */}
                                        </button>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Form to Add Meal */}
            <h2 className="text-xl font-semibold mt-6 mb-4 text-black-500">Add a Meal Plan</h2>
            <form onSubmit={handleAddMeal} className="flex flex-col space-y-4">
                <select
                    value={newMeal.day}
                    onChange={(e) => setNewMeal({ ...newMeal, day: e.target.value })}
                    required
                    className="p-2 border rounded bg-yellow-50 text-black"
                >
                    <option value="" disabled>Select Day</option>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Description of the meal"
                    value={newMeal.description}
                    onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
                    required
                    className="p-2 border rounded bg-yellow-50 text-black"
                />

                <select
                    value={newMeal.tag}
                    onChange={(e) => setNewMeal({ ...newMeal, tag: e.target.value })}
                    required
                    className="p-2 border rounded bg-yellow-50 text-black"
                >
                    <option value="" disabled>Select Meal Type</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="supper">Supper</option>
                </select>

                <button type="submit" className="bg-yellow-500 text-black p-2 rounded">Add Meal</button>
            </form>

            <p className="text-center text-gray-500 mt-4">Enjoy your meals!</p>
        </div>
    );
}
