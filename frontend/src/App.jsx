import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";
import Profile from "./pages/Profile";
import Events from './pages/Event'; 
import MealPlan from './pages/Mealplan'; 
import Task from './pages/Task'; 
import ShoppingList from './pages/Shoppinglist'; 
import { UserProvider } from './context/UserContext';
import { MealPlanProvider } from './context/MealPlanContext';
import { TaskProvider } from './context/TaskContext';
import { EventProvider } from './context/EventContext';
import { ShoppingListProvider } from "./context/ShoppingListContext";


function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <MealPlanProvider>
          <TaskProvider>
           <EventProvider>
           <ShoppingListProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="tasks" element={<Task />} />
            <Route path="events" element={<Events />} />
            <Route path="meal_plan" element={<MealPlan />} />
            <Route path="shopping_list" element={<ShoppingList />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
        </ShoppingListProvider>
         </EventProvider>
        </TaskProvider>
        </MealPlanProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
