import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import API_URL from '../config/api';

const ExpensesPage = ({ mode }) => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allTimeExpenses, setAllTimeExpenses] = useState([]);
    const [monthExpenses, setMonthExpenses] = useState([]);

    const [viewLevel, setViewLevel] = useState('list');
    const [availableMonths, setAvailableMonths] = useState([]);
    const [availableDays, setAvailableDays] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    const [monthViewLevel, setMonthViewLevel] = useState('categories');
    const [monthDays, setMonthDays] = useState([]);
    const [selectedMonthDay, setSelectedMonthDay] = useState(null);

    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [editingExpense, setEditingExpense] = useState(null);
    const [editForm, setEditForm] = useState({ description: '', amount: '', date: '' });
    const [showDatePicker, setShowDatePicker] = useState(false);

    const getPageTitle = () => {
        if (mode === 'all') {
            if (viewLevel === 'categories') return 'All-Time Expenses';
            if (viewLevel === 'months') return 'Select Month';
            if (viewLevel === 'monthCategories') {
                const [year, month] = selectedMonth.split('-');
                const date = new Date(year, parseInt(month) - 1);
                return `Expenses for ${date.toLocaleString('default', { month: 'long', year: 'numeric' })}`;
            }
            if (viewLevel === 'days') return `Select Day`;
            if (viewLevel === 'expenses') return `Expenses`;
            return 'All-Time Expenses';
        }

        if (mode === 'month') {
            const date = new Date();
            const monthName = date.toLocaleString('default', { month: 'long' });
            if (monthViewLevel === 'categories') return `Expenses for ${monthName}`;
            if (monthViewLevel === 'days') return `Select Day`;
            if (monthViewLevel === 'expenses') return `Expenses`;
        }

        switch (mode) {
            case 'today': return "Today's Expenses";
            case 'date':
                const params = new URLSearchParams(location.search);
                return `Expenses on ${params.get('date') || 'Unknown Date'}`;
            default: return 'Expenses';
        }
    };

    const fetchAllTimeData = async () => {
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };

            const [catRes, expRes] = await Promise.all([
                fetch(`${API_URL}/api/categories`, { headers }),
                fetch(`${API_URL}/api/expenses`, { headers })
            ]);

            if (catRes.ok) {
                const catData = await catRes.json();
                setCategories(Array.isArray(catData) ? catData : []);
            }
            if (expRes.ok) {
                const expData = await expRes.json();
                setAllTimeExpenses(Array.isArray(expData) ? expData : []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMonthData = async (month) => {
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };

            if (categories.length === 0) {
                const catRes = await fetch(`${API_URL}/api/categories`, { headers });
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(Array.isArray(catData) ? catData : []);
                }
            }

            const expRes = await fetch(`${API_URL}/api/expenses?month=${month}`, { headers });
            if (expRes.ok) {
                const expData = await expRes.json();
                setMonthExpenses(Array.isArray(expData) ? expData : []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMonths = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/expenses/months`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAvailableMonths(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDays = async (month) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/expenses/days?month=${month}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAvailableDays(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };

            if (categories.length === 0) {
                const catRes = await fetch(`${API_URL}/api/categories`, { headers });
                if (!catRes.ok) throw new Error('Failed to fetch categories');
                const catData = await catRes.json();
                setCategories(Array.isArray(catData) ? catData : []);
            }

            let url = `${API_URL}/api/expenses`;
            const params = new URLSearchParams(location.search);

            if (mode === 'today') {
                const today = new Date().toISOString().split('T')[0];
                url += `?date=${today}`;
            } else if (mode === 'date') {
                const date = params.get('date');
                if (date) url += `?date=${date}`;
            } else if (mode === 'month') {
                const month = new Date().toISOString().slice(0, 7);
                url += `?month=${month}`;
            } else if (mode === 'all') {

                if (viewLevel === 'expenses' && selectedDay) {
                    url += `?date=${selectedDay}`;
                } else {

                    return;
                }
            } else {

            }

            const expRes = await fetch(url, { headers });
            if (!expRes.ok) throw new Error('Failed to fetch expenses');
            const expData = await expRes.json();
            setExpenses(Array.isArray(expData) ? expData : []);
        } catch (error) {
            console.error('Error fetching data:', error);
            setCategories(prev => Array.isArray(prev) ? prev : []);
            setExpenses(prev => Array.isArray(prev) ? prev : []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setSelectedCategory(null);

        if (mode === 'all') {

            setViewLevel('categories');
            fetchAllTimeData();
        } else if (mode === 'month') {

            setMonthViewLevel('categories');
            setSelectedMonthDay(null);
            fetchData();
        } else {
            setViewLevel('list');
            fetchData();
        }
    }, [mode, location.search]);

    const handleViewMonths = () => {
        setViewLevel('months');
        fetchMonths();
    };

    const handleMonthSelect = (month) => {
        setSelectedMonth(month);
        setViewLevel('monthCategories');
        fetchMonthData(month);
    };

    const handleViewDays = () => {
        setViewLevel('days');
        fetchDays(selectedMonth);
    };

    const handleDaySelect = async (day) => {
        setSelectedDay(day);
        setViewLevel('expenses');
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };

            if (categories.length === 0) {
                const catRes = await fetch(`${API_URL}/api/categories`, { headers });
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(Array.isArray(catData) ? catData : []);
                }
            }

            const res = await fetch(`${API_URL}/api/expenses?date=${day}`, { headers });
            const data = await res.json();
            setExpenses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMonthDays = async () => {
        setLoading(true);
        try {
            const currentMonth = new Date().toISOString().slice(0, 7);
            const res = await fetch(`${API_URL}/api/expenses/days?month=${currentMonth}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMonthDays(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMonthViewDays = () => {
        setMonthViewLevel('days');
        fetchMonthDays();
    };

    const handleMonthDaySelect = async (day) => {
        setSelectedMonthDay(day);
        setMonthViewLevel('expenses');
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };

            if (categories.length === 0) {
                const catRes = await fetch(`${API_URL}/api/categories`, { headers });
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(Array.isArray(catData) ? catData : []);
                }
            }

            const res = await fetch(`${API_URL}/api/expenses?date=${day}`, { headers });
            const data = await res.json();
            setExpenses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (selectedCategory) {
            setSelectedCategory(null);
        } else if (mode === 'all') {
            if (viewLevel === 'expenses') {
                setViewLevel('days');
            } else if (viewLevel === 'days') {
                setViewLevel('monthCategories');
            } else if (viewLevel === 'monthCategories') {
                setViewLevel('months');
            } else if (viewLevel === 'months') {
                setViewLevel('categories');
            } else {
                navigate('/');
            }
        } else if (mode === 'month') {
            if (monthViewLevel === 'expenses') {
                setMonthViewLevel('days');
            } else if (monthViewLevel === 'days') {
                setMonthViewLevel('categories');
            } else {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this expense?')) return;
        try {
            await fetch(`${API_URL}/api/expenses/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (mode === 'all' && viewLevel === 'expenses') {
                handleDaySelect(selectedDay);
            } else {
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const handleEditClick = (expense) => {
        setEditingExpense(expense);

        const dateObj = new Date(expense.date);
        const localDate = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000));
        const formattedDate = localDate.toISOString().split('T')[0];

        setEditForm({
            description: expense.description || '',
            amount: expense.amount,
            date: formattedDate
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...editForm,
                category_id: editingExpense.category_id
            };

            console.log('Updating expense:', editingExpense.id, 'with payload:', payload);

            const response = await fetch(`${API_URL}/api/expenses/${editingExpense.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log('Update successful');
                setEditingExpense(null);

                if (mode === 'all' && viewLevel === 'expenses') {
                    handleDaySelect(selectedDay);
                } else if (mode === 'month' && monthViewLevel === 'expenses') {
                    handleMonthDaySelect(selectedMonthDay);
                } else {
                    fetchData();
                }
            } else {
                const errorData = await response.json();
                console.error('Update failed:', response.status, errorData);
                alert(`Failed to update expense: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating expense:', error);
            alert('Error updating expense. Please try again.');
        }
    };

    const groupedExpenses = expenses.reduce((acc, expense) => {
        const cat = categories.find(c => c.id === expense.category_id);
        const catName = cat ? cat.name : 'Uncategorized';
        if (!acc[catName]) acc[catName] = [];
        acc[catName].push(expense);
        return acc;
    }, {});

    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    const expensesToDisplay = selectedCategory
        ? groupedExpenses[selectedCategory] || []
        : [];

    const displayGroups = selectedCategory
        ? { [selectedCategory]: expensesToDisplay }
        : groupedExpenses;

    const renderAllTimeCategories = () => {
        const grouped = allTimeExpenses.reduce((acc, expense) => {
            const cat = categories.find(c => c.id === expense.category_id);
            const catName = cat ? cat.name : 'Uncategorized';
            if (!acc[catName]) acc[catName] = { total: 0, count: 0 };
            acc[catName].total += parseFloat(expense.amount);
            acc[catName].count += 1;
            return acc;
        }, {});

        return (
            <div className="stats-grid" style={{ gap: '0.75rem' }}>
                {Object.entries(grouped).map(([categoryName, data]) => (
                    <div
                        key={categoryName}
                        className="stat-card"
                        style={{ cursor: 'default', padding: '1rem' }}
                    >
                        <div className="stat-label" style={{ fontSize: '0.75rem' }}>{categoryName}</div>
                        <div className="stat-value" style={{ fontSize: '1.5rem' }}>₹{data.total.toFixed(2)}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            {data.count} transaction{data.count !== 1 ? 's' : ''}
                        </div>
                    </div>
                ))}
                {Object.keys(grouped).length === 0 && <div className="text-muted text-center w-full">No expenses found.</div>}
            </div>
        );
    };

    const renderMonthCategories = () => {
        const grouped = monthExpenses.reduce((acc, expense) => {
            const cat = categories.find(c => c.id === expense.category_id);
            const catName = cat ? cat.name : 'Uncategorized';
            if (!acc[catName]) acc[catName] = { total: 0, count: 0 };
            acc[catName].total += parseFloat(expense.amount);
            acc[catName].count += 1;
            return acc;
        }, {});

        return (
            <div className="stats-grid" style={{ gap: '0.75rem' }}>
                {Object.entries(grouped).map(([categoryName, data]) => (
                    <div
                        key={categoryName}
                        className="stat-card"
                        style={{ cursor: 'default', padding: '1rem' }}
                    >
                        <div className="stat-label" style={{ fontSize: '0.75rem' }}>{categoryName}</div>
                        <div className="stat-value" style={{ fontSize: '1.5rem' }}>₹{data.total.toFixed(2)}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            {data.count} transaction{data.count !== 1 ? 's' : ''}
                        </div>
                    </div>
                ))}
                {Object.keys(grouped).length === 0 && <div className="text-muted text-center w-full">No expenses found.</div>}
            </div>
        );
    };

    const renderMonthsGrid = () => (
        <div className="stats-grid">
            {availableMonths.map(month => (
                <div
                    key={month}
                    className="stat-card"
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => handleMonthSelect(month)}
                >
                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                        {new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </div>
                </div>
            ))}
            {availableMonths.length === 0 && <div className="text-muted text-center w-full">No expenses found.</div>}
        </div>
    );

    const renderDaysGrid = () => (
        <div className="stats-grid">
            {availableDays.map(day => (
                <div
                    key={day}
                    className="stat-card"
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => handleDaySelect(day)}
                >
                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                        {new Date(day).toLocaleString('default', { day: '2-digit', weekday: 'short' })}
                    </div>
                    <div className="text-muted text-sm">
                        {new Date(day).toLocaleString('default', { month: 'long' })}
                    </div>
                </div>
            ))}
            {availableDays.length === 0 && <div className="text-muted text-center w-full">No days found for this month.</div>}
        </div>
    );

    const renderMonthDaysGrid = () => (
        <div className="stats-grid">
            {monthDays.map(day => (
                <div
                    key={day}
                    className="stat-card"
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => handleMonthDaySelect(day)}
                >
                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                        {new Date(day).toLocaleString('default', { day: '2-digit', weekday: 'short' })}
                    </div>
                    <div className="text-muted text-sm">
                        {new Date(day).toLocaleString('default', { month: 'long' })}
                    </div>
                </div>
            ))}
            {monthDays.length === 0 && <div className="text-muted text-center w-full">No days found for this month.</div>}
        </div>
    );

    const renderExpensesList = () => (
        <div className="flex flex-col gap-4">
            {Object.entries(displayGroups).map(([categoryName, categoryExpenses]) => (
                <div key={categoryName} className="card">
                    <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                        {categoryName}
                    </h3>
                    <div className="flex flex-col">
                        {categoryExpenses.map(expense => (
                            <div key={expense.id} className="list-item">
                                {editingExpense?.id === expense.id ? (
                                    <form onSubmit={handleUpdate} className="flex gap-2 w-full items-center">
                                        <input
                                            className="input"
                                            style={{ margin: 0, flex: 2 }}
                                            value={editForm.description}
                                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                            placeholder="Description"
                                        />
                                        <input
                                            className="input"
                                            type="number"
                                            step="0.01"
                                            style={{ margin: 0, flex: 1 }}
                                            value={editForm.amount}
                                            onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                                        />
                                        <input
                                            className="input"
                                            type="date"
                                            style={{ margin: 0, flex: 1 }}
                                            value={editForm.date}
                                            onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                                        />
                                        <button type="submit" className="btn btn-sm">Save</button>
                                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingExpense(null)}>Cancel</button>
                                    </form>
                                ) : (
                                    <>
                                        <div>
                                            {expense.description && <div style={{ fontWeight: '600' }}>{expense.description}</div>}
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                {(() => {
                                                    const dateObj = new Date(expense.date);
                                                    const localDate = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000));
                                                    return localDate.toLocaleDateString();
                                                })()}
                                            </div>
                                        </div>
                                        <div className="flex items-center" style={{ gap: '1.5rem' }}>
                                            <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>₹{parseFloat(expense.amount).toFixed(2)}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditClick(expense)}
                                                    className="btn-icon"
                                                    title="Edit"
                                                    style={{ color: 'var(--text-muted)' }}
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(expense.id)}
                                                    className="btn-icon"
                                                    title="Delete"
                                                    style={{ color: 'var(--danger)' }}
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading) return <div className="p-8 text-center" style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Loading...</div>;

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <header className="mb-6 flex justify-between items-center" style={{ marginBottom: '3rem' }}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 1rem' }}
                    >
                        ← Back
                    </button>
                    <h1>
                        {selectedCategory ? selectedCategory : getPageTitle()}
                    </h1>
                </div>
                <div className="flex items-center" style={{ gap: '1.5rem' }}>

                    {}
                    {mode === 'all' && viewLevel === 'categories' && (
                        <button className="btn btn-secondary" onClick={handleViewMonths}>
                            View Months →
                        </button>
                    )}
                    {mode === 'all' && viewLevel === 'monthCategories' && (
                        <button className="btn btn-secondary" onClick={handleViewDays}>
                            View Days →
                        </button>
                    )}
                    {}
                    {mode === 'month' && monthViewLevel === 'categories' && !selectedCategory && (
                        <button className="btn btn-secondary" onClick={handleMonthViewDays}>
                            View Days →
                        </button>
                    )}

                    {}
                    {((mode !== 'all' && mode !== 'month') ||
                        (mode === 'all' && viewLevel === 'expenses') ||
                        (mode === 'month' && monthViewLevel === 'expenses')) && (
                            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                Total: ₹{selectedCategory
                                    ? expensesToDisplay.reduce((sum, e) => sum + parseFloat(e.amount), 0).toFixed(2)
                                    : totalExpenses.toFixed(2)}
                            </span>
                        )}
                    {}
                    {mode === 'month' && !selectedCategory && (
                        <div style={{ position: 'relative' }}>
                            <button
                                className="calendar-picker-btn"
                                title="Select a date with expenses"
                                onClick={() => setShowDatePicker(!showDatePicker)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            </button>
                            {showDatePicker && (
                                <div
                                    className="date-dropdown"
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        marginTop: '0.5rem',
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '0.5rem 0',
                                        minWidth: '150px',
                                        boxShadow: 'var(--shadow)',
                                        zIndex: 100
                                    }}
                                >
                                    {[...new Set(expenses.map(e => e.date.split('T')[0]))].sort().reverse().map(date => (
                                        <button
                                            key={date}
                                            onClick={() => {
                                                navigate(`/expenses/date?date=${date}`);
                                                setShowDatePicker(false);
                                            }}
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                padding: '0.5rem 1rem',
                                                textAlign: 'left',
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'var(--text-main)',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                            onMouseEnter={e => e.target.style.background = 'var(--bg-card-hover)'}
                                            onMouseLeave={e => e.target.style.background = 'transparent'}
                                        >
                                            {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </button>
                                    ))}
                                    {expenses.length === 0 && (
                                        <div style={{ padding: '0.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            No expenses
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {}
            {mode === 'all' && viewLevel === 'categories' && renderAllTimeCategories()}
            {mode === 'all' && viewLevel === 'months' && renderMonthsGrid()}
            {mode === 'all' && viewLevel === 'monthCategories' && renderMonthCategories()}
            {mode === 'all' && viewLevel === 'days' && renderDaysGrid()}

            {}
            {mode === 'month' && monthViewLevel === 'categories' && !selectedCategory && (
                <div className="stats-grid" style={{ gap: '0.75rem' }}>
                    {Object.entries(groupedExpenses).map(([categoryName, items]) => {
                        const catTotal = items.reduce((sum, e) => sum + parseFloat(e.amount), 0);
                        return (
                            <div
                                key={categoryName}
                                className="stat-card"
                                style={{ cursor: 'default', padding: '1rem' }}
                            >
                                <div className="stat-label" style={{ fontSize: '0.75rem' }}>{categoryName}</div>
                                <div className="stat-value" style={{ fontSize: '1.5rem' }}>₹{catTotal.toFixed(2)}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                    {items.length} transaction{items.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                        );
                    })}
                    {Object.keys(groupedExpenses).length === 0 && <div className="text-muted text-center w-full">No expenses found.</div>}
                </div>
            )}
            {mode === 'month' && monthViewLevel === 'days' && renderMonthDaysGrid()}
            {mode === 'month' && monthViewLevel === 'expenses' && renderExpensesList()}

            {}
            {((mode === 'all' && viewLevel === 'expenses') || (mode !== 'all' && mode !== 'month')) && (
                <>
                    {}
                    {expenses.length === 0 ? (
                        <div className="card text-center text-muted">
                            No expenses found for this view.
                        </div>
                    ) : (
                        renderExpensesList()
                    )}
                </>
            )}
        </div>
    );
};

export default ExpensesPage;
