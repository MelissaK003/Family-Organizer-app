import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from './UserContext';

export const MealPlanContext = createContext();

export const MealPlanProvider = ({ children }) => {
    const [mealPlans, setMealPlans] = useState([]);
    const { current_user, authToken } = useContext(UserContext);

    // Fetch all meal plans
    const fetchMealPlans = async () => {
        try {
            const response = await fetch('https://family-organizer-app.onrender.com/mealplans', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setMealPlans(data);
            } else {
                toast.error(data.error || 'Failed to fetch meal plans');
            }
        } catch (error) {
            console.error('Error fetching meal plans:', error);
            toast.error('Network error while fetching meal plans');
        }
    };

    // Update meal plan
    const updateMealPlan = async (mealplanId, tag, description, day) => {
        try {
            const response = await fetch(`https://family-organizer-app.onrender.com/mealplan/${mealplanId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    tag,
                    description,
                    day,
                    user_id: current_user?.id
                })
            });
            const data = await response.json();

            if (response.ok) {
                toast.success(data.success);
                fetchMealPlans();
            } else {
                toast.error(data.error || 'Failed to update meal plan');
            }
        } catch (error) {
            console.error('Error updating meal plan:', error);
            toast.error('Network error while updating meal plan');
        }
    };

    // Add new meal plan or update existing one
    const addMealPlan = async (tag, description, day) => {
        try {
            const existingMeal = mealPlans.find(meal => meal.day === day && meal.tag === tag);

            if (existingMeal) {
                return updateMealPlan(existingMeal.id, tag, description, day); 
            }

            const response = await fetch('https://family-organizer-app.onrender.com/mealplan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    tag,
                    description,
                    day,
                    user_id: current_user?.id
                })
            });
            const data = await response.json();

            if (response.ok) {
                toast.success(data.success);
                fetchMealPlans(); 
            } else {
                toast.error(data.error || 'Failed to add meal plan');
            }
        } catch (error) {
            console.error('Error adding meal plan:', error);
            toast.error('Network error while adding meal plan');
        }
    };

    // Delete meal plan
    const deleteMealPlan = async (mealplanId) => {
        try {
            const response = await fetch(`https://family-organizer-app.onrender.com/mealplan/${mealplanId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                toast.success(data.success);
                fetchMealPlans(); 
            } else {
                toast.error(data.error || 'Failed to delete meal plan');
            }
        } catch (error) {
            console.error('Error deleting meal plan:', error);
            toast.error('Network error while deleting meal plan');
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchMealPlans();
        }
    }, [authToken]);

    return (
        <MealPlanContext.Provider value={{
            mealPlans,
            addMealPlan,
            deleteMealPlan,
            updateMealPlan,
            fetchMealPlans
        }}>
            {children}
        </MealPlanContext.Provider>
    );
};
