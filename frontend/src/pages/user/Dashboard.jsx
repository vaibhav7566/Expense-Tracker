// src/pages/Dashboard.jsx  (or wherever)
import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Tag,
  TrendingUp,
  X,
  ShoppingBag,


   
  Home,
  Car,
  Utensils,
  Film,
  Heart,
  Sparkles,
  Search
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchExpensesAsync,
  addExpenseAsync,
  updateExpenseAsync,
  deleteExpenseAsync
} from '../../store/slices/expensesReducer';
import Navbar from '../../components/Navbar';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: reduxExpenses, status: expensesStatus, error: expensesError } = useSelector(state => state.expenses || { items: [], status: 'idle', error: null });
  const { user } = useSelector(state => state.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchExpensesAsync());
    }
  }, [dispatch, user])

  

  // local UI state
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showValidation, setShowValidation] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Other'];
  const categoryIcons = { Food: Utensils, Transport: Car, Shopping: ShoppingBag, Entertainment: Film, Bills: Home, Healthcare: Heart, Other: Tag };
  const categoryColors = {
    Food: 'from-orange-500 to-red-500',
    Transport: 'from-blue-500 to-cyan-500',
    Shopping: 'from-purple-500 to-pink-500',
    Entertainment: 'from-yellow-500 to-orange-500',
    Bills: 'from-green-500 to-emerald-500',
    Healthcare: 'from-red-500 to-pink-500',
    Other: 'from-gray-500 to-slate-500'
  };

  // Pull expenses from redux (fall back to empty array)
  const expenses = reduxExpenses || [];

  // derived totals
  const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const categoryWiseSummary = expenses.reduce((acc, exp) => {
    if (!acc[exp.category]) acc[exp.category] = 0;
    acc[exp.category] += Number(exp.amount) || 0;
    return acc;
  }, {});

  // filters
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || expense.category === filterCategory;
    const matchesDateFrom = !filterDateFrom || new Date(expense.date) >= new Date(filterDateFrom);
    const matchesDateTo = !filterDateTo || new Date(expense.date) <= new Date(filterDateTo);
    return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo;
  });

  // validation (same as before)
  const validateForm = (data) => {
    const errs = {};
    if (!data.title || !data.title.toString().trim()) errs.title = 'Title is required';
    else if (data.title.toString().trim().length < 2) errs.title = 'Title should be at least 2 characters';

    const amount = parseFloat(data.amount);
    if (data.amount === '' || data.amount === null || data.amount === undefined) errs.amount = 'Amount is required';
    else if (Number.isNaN(amount) || !Number.isFinite(amount)) errs.amount = 'Amount must be a valid number';
    else if (amount <= 0) errs.amount = 'Amount must be greater than 0';

    if (!data.category || !data.category.toString().trim()) errs.category = 'Category is required';
    else if (!categories.includes(data.category)) errs.category = 'Invalid category';

    if (!data.date) errs.date = 'Date is required';
    else {
      const d = new Date(data.date);
      if (isNaN(d.getTime())) errs.date = 'Invalid date';
    }
    return errs;
  };

  useEffect(() => {
    // fetch expenses when component mounts
    dispatch(fetchExpensesAsync());
  }, [dispatch]);

  useEffect(() => {
    // mirror validation errors for UI
    setErrors(validateForm(formData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const shouldShowError = (field) => showValidation || !!touched[field];
  const isFormValid = () => Object.keys(validateForm(formData)).length === 0;

  // submit handler that uses thunks
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setShowValidation(true);
    setTouched({ title: true, amount: true, category: true, date: true });

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the validation errors');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingExpense) {
        // update via thunk
        const payload = { id: editingExpense._id, updates: { ...formData, amount: parseFloat(formData.amount) } };
        const result = await dispatch(updateExpenseAsync(payload)).unwrap();
        toast.success('Expense updated');
      } else {
        const toCreate = { ...formData, amount: parseFloat(formData.amount) };
        const created = await dispatch(addExpenseAsync(toCreate)).unwrap();
        // created should be added to redux by slice
        toast.success('Expense added');
      }
      resetForm();
    } catch (err) {
      // err may be object or string
      const msg = (err && (err.message || err.error || err.msg)) || 'Server error';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date
    });
    setTouched({});
    setShowValidation(false);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    // if (!window.confirm('Delete this expense?')) return;
    try {
      // console.log('Deleting expense with id:', id);
      await dispatch(deleteExpenseAsync(id)).unwrap();

      toast.info('Expense deleted');
    } catch (err) {
      const msg = (err && (err.message || err.error)) || 'Delete failed';
      toast.error(msg);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0]
    });
    setEditingExpense(null);
    setErrors({});
    setTouched({});
    setShowValidation(false);
    setFocusedField(null);
    setShowModal(false);
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFocusedField(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-4 sm:p-6 lg:p-8">
      {/* BG elements omitted for brevity (kept same as your code) */}
     
     
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-gray-400" />
              <h1 className="text-3xl sm:text-4xl font-bold">Expense Tracker</h1>
            </div>
            <p className="text-gray-400">Track and manage your expenses</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg hover:shadow-lg hover:shadow-gray-800/50 transition-all transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6 hover:border-gray-600/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Expenses</span>
              <DollarSign className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
            <p className="text-gray-500 text-sm mt-1">{expenses.length} transactions</p>
          </div>

          {Object.entries(categoryWiseSummary).slice(0, 3).map(([category, amount]) => {
            const Icon = categoryIcons[category];
            const colorClass = categoryColors[category];
            return (
              <div key={category} className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6 hover:border-gray-600/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">{category}</span>
                  <Icon className="w-5 h-5 text-gray-500" />
                </div>
                <p className="text-3xl font-bold">${amount.toFixed(2)}</p>
                <div className="mt-2 h-1 bg-gray-700/50 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${colorClass}`} style={{ width: `${(amount / (totalExpenses || 1)) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Category Summary (same as before) */}
        <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Category Breakdown
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(categoryWiseSummary).map(([category, amount]) => {
              const Icon = categoryIcons[category];
              const colorClass = categoryColors[category];
              const percentage = ((amount / (totalExpenses || 1)) * 100).toFixed(1);
              return (
                <div key={category} className="bg-gray-900/50 rounded-xl p-4 hover:bg-gray-900/70 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClass}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">{category}</p>
                      <p className="text-lg font-bold">${amount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{percentage}% of total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Recent Expenses</h2>

          {/* Search & Filters (same) */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search expenses..."
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-gray-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Category</label>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-600">
                  <option value="All">All Categories</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">From Date</label>
                <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-600" />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">To Date</label>
                <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-600" />
              </div>
            </div>

            {(searchTerm || filterCategory !== 'All' || filterDateFrom || filterDateTo) && (
              <button onClick={() => { setSearchTerm(''); setFilterCategory('All'); setFilterDateFrom(''); setFilterDateTo(''); }} className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm transition-colors">
                <X className="w-4 h-4" /> Clear Filters
              </button>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Showing {filteredExpenses.length} of {expenses.length} expenses</span>
              {filteredExpenses.length > 0 && <span>Total: ${filteredExpenses.reduce((s, e) => s + Number(e.amount || 0), 0).toFixed(2)}</span>}
            </div>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{expenses.length === 0 ? 'No expenses yet. Add your first expense!' : 'No expenses match your filters.'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExpenses.map((expense) => {
                const Icon = categoryIcons[expense.category];
                const colorClass = categoryColors[expense.category];
                return (
                  <div key={expense.id} className="bg-gray-900/50 rounded-xl p-4 hover:bg-gray-900/70 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClass} flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{expense.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                          <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{expense.category}</span>
                          <span className="flex items-center gap-1 "><Calendar className="w-3 h-3 " />{new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold">${Number(expense.amount).toFixed(2)}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(expense)} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(expense._id)} className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
              <button type="button" onClick={resetForm} className="p-2 hover:bg-gray-800 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                <input name="title" type="text" value={formData.title} onChange={handleChange} onFocus={() => setFocusedField('title')} onBlur={handleBlur}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-3 focus:outline-none transition-all duration-300 ${(shouldShowError('title') && errors.title) ? 'border-red-500' : focusedField === 'title' ? 'border-gray-600 bg-gray-900/70 shadow-lg shadow-gray-800/50' : 'border-gray-700'}`}
                  placeholder="e.g., Groceries" />
                {shouldShowError('title') && errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
                <input name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} onFocus={() => setFocusedField('amount')} onBlur={handleBlur}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-3 focus:outline-none transition-all duration-300 ${(shouldShowError('amount') && errors.amount) ? 'border-red-500' : focusedField === 'amount' ? 'border-gray-600 bg-gray-900/70 shadow-lg shadow-gray-800/50' : 'border-gray-700'}`} placeholder="0.00" />
                {shouldShowError('amount') && errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} onFocus={() => setFocusedField('category')} onBlur={handleBlur}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-3 focus:outline-none transition-all duration-300 ${(shouldShowError('category') && errors.category) ? 'border-red-500' : focusedField === 'category' ? 'border-gray-600 bg-gray-900/70 shadow-lg shadow-gray-800/50' : 'border-gray-700'}`}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {shouldShowError('category') && errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
                <input name="date" type="date" value={formData.date} onChange={handleChange} onFocus={() => setFocusedField('date')} onBlur={handleBlur}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-3 focus:outline-none transition-all duration-300 ${(shouldShowError('date') && errors.date) ? 'border-red-500' : focusedField === 'date' ? 'border-gray-600 bg-gray-900/70 shadow-lg shadow-gray-800/50' : 'border-gray-700'}`} />
                {shouldShowError('date') && errors.date && <p className="text-xs text-red-400 mt-1">{errors.date}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={resetForm} className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={!isFormValid() || isSubmitting} className={`flex-1 px-4 py-3 rounded-lg transition-all transform hover:scale-105 ${isFormValid() && !isSubmitting ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:shadow-lg hover:shadow-gray-800/50' : 'bg-gray-700/30 cursor-not-allowed'}`}>
                  {isSubmitting ? (editingExpense ? 'Updating...' : 'Adding...') : (editingExpense ? 'Update' : 'Add') + ' Expense'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
