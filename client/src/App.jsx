import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import CategoryDetails from './pages/CategoryDetails';
import RecordExpense from './pages/RecordExpense';
import ExpensesPage from './pages/ExpensesPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/:id"
            element={
              <ProtectedRoute>
                <CategoryDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/record-expenses"
            element={
              <ProtectedRoute>
                <RecordExpense />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses/today"
            element={
              <ProtectedRoute>
                <ExpensesPage mode="today" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses/date"
            element={
              <ProtectedRoute>
                <ExpensesPage mode="date" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses/month"
            element={
              <ProtectedRoute>
                <ExpensesPage mode="month" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses/all"
            element={
              <ProtectedRoute>
                <ExpensesPage mode="all" />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
