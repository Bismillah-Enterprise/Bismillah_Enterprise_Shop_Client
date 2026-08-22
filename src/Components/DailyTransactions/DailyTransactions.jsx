import React, { useEffect, useRef, useState } from 'react';
import { NumberFormatBase } from 'react-number-format';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loading from '../Shared/Loading/Loading';
import {
    MdOutlineCancel,
    MdTrendingUp,
    MdTrendingDown,
    MdAccountBalanceWallet
} from 'react-icons/md';
import { PuffLoader } from 'react-spinners';
import useCurrentUser from '../Hooks/useCurrentUser';

const API = 'https://bismillah-enterprise-server.onrender.com';

const DailyTransactions = () => {
    const [tab, setTab] = useState('revenue');
    const [reload, setReload] = useState(false);

    const [computer, setComputer] = useState(0);
    const [stationary, setStationary] = useState(0);
    const [photocopy, setPhotocopy] = useState(0);
    const [others, setOthers] = useState(0);
    const [expenses, setExpenses] = useState(0);

    const [rvAmount, setRvAmount] = useState('');
    const [exAmount, setExAmount] = useState('');

    const [loading, setLoading] = useState(false);

    const [allData, setAllData] = useState({});
    const [details, setDetails] = useState([]);
    const [modal, setModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [deleteItem, setDeleteItem] = useState('');

    const [allTRX, setAllTRX] = useState([]);

    const [rvCategory, setRvCategory] = useState('');

    const [current_User] = useCurrentUser();

    /* =====================================================
       REFS
    ===================================================== */

    const revenueCategoryRef = useRef(null);
    const revenueCommentRef = useRef(null);
    const expenseCommentRef = useRef(null);

    /* =====================================================
       DATE
    ===================================================== */

    const getCurrentDate = () => {
        const now = new Date();

        return now.toLocaleDateString('en-BD', {
            day: 'numeric',
            year: 'numeric',
            month: 'long',
        });
    };

    const currentDate = getCurrentDate();

    /* =====================================================
       LOAD DAILY TRANSACTIONS
    ===================================================== */

    useEffect(() => {
        const loadDailyTransactions = async () => {
            try {
                const response = await fetch(`${API}/daily_transactions`);

                if (!response.ok) {
                    throw new Error('Failed to load daily transactions.');
                }

                const data = await response.json();

                const computerRevenue = Number(data?.computer_revenues) || 0;
                const stationaryRevenue = Number(data?.stationary_revenues) || 0;
                const photocopyRevenue = Number(data?.photocopy_revenues) || 0;

                const othersRevenue =
                    Array.isArray(data?.others_revenues)
                        ? data.others_revenues.reduce(
                            (sum, item) => sum + (Number(item?.amount) || 0),
                            0
                        )
                        : 0;

                const totalExpenses =
                    Array.isArray(data?.expenses)
                        ? data.expenses.reduce(
                            (sum, item) => sum + (Number(item?.amount) || 0),
                            0
                        )
                        : 0;

                setComputer(computerRevenue);
                setStationary(stationaryRevenue);
                setPhotocopy(photocopyRevenue);
                setOthers(othersRevenue);
                setExpenses(totalExpenses);

                setAllData(data || {});
                setAllTRX(Array.isArray(data?.summary) ? data.summary : []);
            } catch (error) {
                console.error('Daily transaction loading error:', error);

                Swal.fire({
                    icon: 'error',
                    title: 'Could not load transactions',
                    text: error.message,
                    background: '#0b1b18',
                    color: '#fff',
                });
            }
        };

        loadDailyTransactions();
    }, [reload]);

    /* =====================================================
       HELPERS
    ===================================================== */

    const resetRevenueForm = () => {
        setRvAmount('');
        setRvCategory('');

        if (revenueCategoryRef.current) {
            revenueCategoryRef.current.value = '';
        }

        if (revenueCommentRef.current) {
            revenueCommentRef.current.value = '';
        }
    };

    const resetExpenseForm = () => {
        setExAmount('');

        if (expenseCommentRef.current) {
            expenseCommentRef.current.value = '';
        }
    };

    const showSuccess = (title = 'Transaction Added Successfully') => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title,
            showConfirmButton: false,
            timer: 1100,
            background: '#0b1b18',
            color: '#fff',
        });
    };

    const showError = (title, text = '') => {
        Swal.fire({
            icon: 'error',
            title,
            text,
            background: '#0b1b18',
            color: '#fff',
        });
    };

    /* =====================================================
       REVENUE TRANSACTION
    ===================================================== */

    const handleRevenueTransections = async () => {
        const revenueAmount = Number(rvAmount);

        const revenueCategory =
            revenueCategoryRef.current?.value || rvCategory || '';

        const revenueComment =
            revenueCommentRef.current?.value?.trim() || '';

        /* Validation */

        if (!revenueAmount || revenueAmount <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Amount',
                text: 'Please enter a valid revenue amount.',
                background: '#0b1b18',
                color: '#fff',
            });

            return;
        }

        if (!revenueCategory) {
            Swal.fire({
                icon: 'warning',
                title: 'Select Category',
                text: 'Please select a revenue category.',
                background: '#0b1b18',
                color: '#fff',
            });

            return;
        }

        if (revenueCategory === 'Others' && !revenueComment) {
            Swal.fire({
                icon: 'warning',
                title: 'Description Required',
                text: 'Please enter a description for Others revenue.',
                background: '#0b1b18',
                color: '#fff',
            });

            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API}/daily_transactions`);

            if (!response.ok) {
                throw new Error('Could not load current transaction data.');
            }

            const data = await response.json();

            const gotDate = data?.date;

            const existingComputer =
                Number(data?.computer_revenues) || 0;

            const existingStationary =
                Number(data?.stationary_revenues) || 0;

            const existingPhotocopy =
                Number(data?.photocopy_revenues) || 0;

            const existingOthers =
                Array.isArray(data?.others_revenues)
                    ? data.others_revenues
                    : [];

            const existingExpenses =
                Array.isArray(data?.expenses)
                    ? data.expenses
                    : [];

            /* =================================================
               SAME DAY
            ================================================= */

            if (gotDate === currentDate) {
                const transactionData = {
                    date: currentDate,
                    amount: revenueAmount,
                    category: revenueCategory,
                    comment: revenueComment,
                };

                const transactionResponse = await fetch(
                    `${API}/daily_revenue_transactions`,
                    {
                        method: 'PATCH',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify(transactionData),
                    }
                );

                if (!transactionResponse.ok) {
                    throw new Error('Revenue transaction failed.');
                }

                const result = await transactionResponse.json();

                if (!result?.acknowledged) {
                    throw new Error(
                        'Server did not acknowledge the transaction.'
                    );
                }

                resetRevenueForm();
                setReload(prev => !prev);

                showSuccess('Revenue Added Successfully');

                return;
            }

            /* =================================================
               NEW DAY + NO PREVIOUS TRANSACTION
            ================================================= */

            const noPreviousTransaction =
                existingComputer === 0 &&
                existingStationary === 0 &&
                existingPhotocopy === 0 &&
                existingOthers.length === 0 &&
                existingExpenses.length === 0;

            if (noPreviousTransaction) {
                const transactionData = {
                    date: currentDate,
                    amount: revenueAmount,
                    category: revenueCategory,
                    comment: revenueComment,
                };

                const transactionResponse = await fetch(
                    `${API}/daily_revenue_transactions`,
                    {
                        method: 'PATCH',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify(transactionData),
                    }
                );

                if (!transactionResponse.ok) {
                    throw new Error('Revenue transaction failed.');
                }

                const result = await transactionResponse.json();

                if (!result?.acknowledged) {
                    throw new Error(
                        'Server did not acknowledge the transaction.'
                    );
                }

                resetRevenueForm();
                setReload(prev => !prev);

                showSuccess('Revenue Added Successfully');

                return;
            }

            /* =================================================
               NEW DAY + PREVIOUS DAY HAS TRANSACTIONS

               IMPORTANT:
               Backend expects arrays directly.
            ================================================= */

            const transactionSummary = {
                update_info: {
                    update_date: currentDate,
                    amount: revenueAmount,
                    category: revenueCategory,
                    comment: revenueComment,
                },

                category: revenueCategory,

                date: gotDate,

                computer_revenues: existingComputer,

                stationary_revenues: existingStationary,

                photocopy_revenues: existingPhotocopy,

                others_revenues: existingOthers,

                expenses: existingExpenses,
            };

            const resetResponse = await fetch(
                `${API}/reset_daily_transactions`,
                {
                    method: 'PATCH',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(transactionSummary),
                }
            );

            if (!resetResponse.ok) {
                throw new Error('Could not reset daily transactions.');
            }

            const resetResult = await resetResponse.json();

            if (!resetResult?.acknowledged) {
                throw new Error(
                    'Server did not acknowledge the daily reset.'
                );
            }

            resetRevenueForm();
            setReload(prev => !prev);

            showSuccess('New Day Revenue Added Successfully');
        } catch (error) {
            console.error(error);

            showError(
                'Revenue Transaction Failed',
                error.message
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       EXPENSE TRANSACTION
    ===================================================== */

    const handleExpenseTransections = async () => {
        const expenseAmount = Number(exAmount);

        const expenseComment =
            expenseCommentRef.current?.value?.trim() || '';

        if (!expenseAmount || expenseAmount <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Amount',
                text: 'Please enter a valid expense amount.',
                background: '#0b1b18',
                color: '#fff',
            });

            return;
        }

        if (!expenseComment) {
            Swal.fire({
                icon: 'warning',
                title: 'Description Required',
                text: 'Please enter what this expense is for.',
                background: '#0b1b18',
                color: '#fff',
            });

            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API}/daily_transactions`
            );

            if (!response.ok) {
                throw new Error(
                    'Could not load current transaction data.'
                );
            }

            const data = await response.json();

            const gotDate = data?.date;

            const existingComputer =
                Number(data?.computer_revenues) || 0;

            const existingStationary =
                Number(data?.stationary_revenues) || 0;

            const existingPhotocopy =
                Number(data?.photocopy_revenues) || 0;

            const existingOthers =
                Array.isArray(data?.others_revenues)
                    ? data.others_revenues
                    : [];

            const existingExpenses =
                Array.isArray(data?.expenses)
                    ? data.expenses
                    : [];

            /* =================================================
               SAME DAY
            ================================================= */

            if (gotDate === currentDate) {
                const transactionData = {
                    date: currentDate,
                    amount: expenseAmount,
                    comment: expenseComment,
                };

                const transactionResponse = await fetch(
                    `${API}/daily_expense_transactions`,
                    {
                        method: 'PATCH',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify(transactionData),
                    }
                );

                if (!transactionResponse.ok) {
                    throw new Error(
                        'Expense transaction failed.'
                    );
                }

                const result =
                    await transactionResponse.json();

                if (!result?.acknowledged) {
                    throw new Error(
                        'Server did not acknowledge the transaction.'
                    );
                }

                resetExpenseForm();
                setReload(prev => !prev);

                showSuccess('Expense Added Successfully');

                return;
            }

            /* =================================================
               NEW DAY + NO PREVIOUS TRANSACTION
            ================================================= */

            const noPreviousTransaction =
                existingComputer === 0 &&
                existingStationary === 0 &&
                existingPhotocopy === 0 &&
                existingOthers.length === 0 &&
                existingExpenses.length === 0;

            if (noPreviousTransaction) {
                const transactionData = {
                    date: currentDate,
                    amount: expenseAmount,
                    comment: expenseComment,
                };

                const transactionResponse = await fetch(
                    `${API}/daily_expense_transactions`,
                    {
                        method: 'PATCH',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify(transactionData),
                    }
                );

                if (!transactionResponse.ok) {
                    throw new Error(
                        'Expense transaction failed.'
                    );
                }

                const result =
                    await transactionResponse.json();

                if (!result?.acknowledged) {
                    throw new Error(
                        'Server did not acknowledge the transaction.'
                    );
                }

                resetExpenseForm();
                setReload(prev => !prev);

                showSuccess('Expense Added Successfully');

                return;
            }

            /* =================================================
               NEW DAY + PREVIOUS DAY HAS TRANSACTIONS

               IMPORTANT:
               Send arrays because backend stores them directly.
            ================================================= */

            const expenseSummary = {
                update_info: {
                    update_date: currentDate,
                    amount: expenseAmount,
                    comment: expenseComment,
                },

                category: 'Expense',

                date: gotDate,

                computer_revenues: existingComputer,

                stationary_revenues: existingStationary,

                photocopy_revenues: existingPhotocopy,

                others_revenues: existingOthers,

                expenses: existingExpenses,
            };

            const resetResponse = await fetch(
                `${API}/reset_daily_transactions`,
                {
                    method: 'PATCH',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(expenseSummary),
                }
            );

            if (!resetResponse.ok) {
                throw new Error(
                    'Could not reset daily transactions.'
                );
            }

            const resetResult =
                await resetResponse.json();

            if (!resetResult?.acknowledged) {
                throw new Error(
                    'Server did not acknowledge the daily reset.'
                );
            }

            resetExpenseForm();
            setReload(prev => !prev);

            showSuccess(
                'New Day Expense Added Successfully'
            );
        } catch (error) {
            console.error(error);

            showError(
                'Expense Transaction Failed',
                error.message
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       DELETE DETAILS
    ===================================================== */

    const handleDelete = async (index, item) => {
        setModalLoading(true);

        const oldExpenses = Array.isArray(allData?.expenses)
            ? [...allData.expenses]
            : [];

        const oldOthers = Array.isArray(
            allData?.others_revenues
        )
            ? [...allData.others_revenues]
            : [];

        if (item === 'expenses') {
            oldExpenses.splice(index, 1);
        } else {
            oldOthers.splice(index, 1);
        }

        const updateData = {
            category: item,
            update:
                item === 'expenses'
                    ? oldExpenses
                    : oldOthers,
        };

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#334155',
            confirmButtonText: 'Yes, delete it!',
            background: '#0b1b18',
            color: '#fff',
        });

        if (!result.isConfirmed) {
            setModalLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${API}/update_expenses`,
                {
                    method: 'PATCH',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(updateData),
                }
            );

            if (!response.ok) {
                throw new Error(
                    'Could not delete transaction.'
                );
            }

            await response.json();

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Deleted Successfully',
                showConfirmButton: false,
                timer: 1000,
                background: '#0b1b18',
                color: '#fff',
            });

            setDetails(
                item === 'expenses'
                    ? oldExpenses
                    : oldOthers
            );

            setReload(prev => !prev);
        } catch (error) {
            console.error(error);

            showError(
                'Delete Failed',
                error.message
            );
        } finally {
            setModalLoading(false);
        }
    };

    /* =====================================================
       TOTALS
    ===================================================== */

    const totalComputer =
        (allTRX?.reduce(
            (sum, item) =>
                sum + (Number(item?.computer_revenues) || 0),
            0
        ) || 0) + computer;

    const totalStationary =
        (allTRX?.reduce(
            (sum, item) =>
                sum + (Number(item?.stationary_revenues) || 0),
            0
        ) || 0) + stationary;

    const totalPhotocopy =
        (allTRX?.reduce(
            (sum, item) =>
                sum + (Number(item?.photocopy_revenues) || 0),
            0
        ) || 0) + photocopy;

    const totalOthers =
        (allTRX?.reduce((sum, item) => {
            if (!Array.isArray(item?.others_revenues)) {
                return sum;
            }

            return (
                sum +
                item.others_revenues.reduce(
                    (innerSum, revenue) =>
                        innerSum +
                        (Number(revenue?.amount) || 0),
                    0
                )
            );
        }, 0) || 0) + others;

    const totalExpenses =
        (allTRX?.reduce((sum, item) => {
            if (!Array.isArray(item?.expenses)) {
                return sum;
            }

            return (
                sum +
                item.expenses.reduce(
                    (innerSum, expense) =>
                        innerSum +
                        (Number(expense?.amount) || 0),
                    0
                )
            );
        }, 0) || 0) + expenses;

    const totalRevenue =
        computer +
        stationary +
        photocopy +
        others;

    const totalCash =
        totalRevenue - expenses;

    return (
        <div className="min-h-full relative pt-5 pb-12 text-slate-200">

            {/* Ambient background */}

            <div className="pointer-events-none fixed -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-[130px]" />

            <div className="pointer-events-none fixed top-[30%] -right-40 w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[140px]" />

            <div className="pointer-events-none fixed -bottom-52 left-[35%] w-[450px] h-[450px] rounded-full bg-violet-500/10 blur-[150px]" />


            {/* =================================================
			    DETAILS MODAL
			================================================= */}

            {modal && (
                <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">

                    <div className="w-full max-w-xl rounded-3xl border border-cyan-400/20 bg-[#0b1c18]/95 shadow-2xl shadow-cyan-500/10">

                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">

                            <div>
                                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                                    Transaction Details
                                </p>

                                <h2 className="text-xl font-bold text-white mt-1">
                                    {deleteItem === 'expenses'
                                        ? 'Expense Details'
                                        : 'Other Revenue Details'}
                                </h2>
                            </div>

                            <button
                                onClick={() => setModal(false)}
                                className="rounded-xl p-2 hover:bg-white/5"
                            >
                                <MdOutlineCancel className="text-2xl text-slate-400 hover:text-red-400" />
                            </button>

                        </div>


                        <div className="max-h-[420px] overflow-y-auto p-5 scrollbar-hide">

                            {modalLoading ? (
                                <div className="h-60 flex items-center justify-center">
                                    <Loading />
                                </div>
                            ) : (
                                <table className="w-full text-sm">

                                    <thead>
                                        <tr className="border-b border-white/10 text-slate-500">
                                            <th className="text-left py-3">#</th>
                                            <th className="text-left py-3">
                                                Description
                                            </th>
                                            <th className="text-right py-3">
                                                Amount
                                            </th>
                                            <th />
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {details?.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-white/5"
                                            >

                                                <td className="py-3 text-slate-500">
                                                    {index + 1}
                                                </td>

                                                <td className="py-3 text-white">
                                                    {item?.comment || '—'}
                                                </td>

                                                <td
                                                    className={`py-3 text-right font-semibold ${deleteItem === 'expenses'
                                                        ? 'text-red-400'
                                                        : 'text-emerald-400'
                                                        }`}
                                                >
                                                    {Number(item?.amount) || 0}
                                                </td>

                                                <td className="text-right">

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                index,
                                                                deleteItem
                                                            )
                                                        }
                                                        className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                                    >
                                                        −
                                                    </button>

                                                </td>

                                            </tr>
                                        ))}

                                    </tbody>

                                    <tfoot>

                                        <tr>

                                            <td />

                                            <td className="py-4 font-bold text-white">
                                                Total
                                            </td>

                                            <td className="py-4 text-right font-black text-cyan-300">

                                                {details?.reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        (Number(item?.amount) || 0),
                                                    0
                                                )}

                                            </td>

                                            <td />

                                        </tr>

                                    </tfoot>

                                </table>
                            )}

                        </div>

                    </div>
                </div>
            )}


            <div className="max-w-6xl mx-auto">

                {/* =================================================
				    HEADER
				================================================= */}

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">

                    <div>

                        <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
                            Finance Control
                        </p>

                        <h1 className="text-3xl md:text-4xl font-black text-white mt-1">
                            Daily Transactions
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Track today's revenue, expenses and available cash.
                        </p>

                    </div>

                    <Link
                        to="/"
                        className="w-fit px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-emerald-400/30 hover:text-emerald-300 transition-all"
                    >
                        Back
                    </Link>

                </div>


                {/* =================================================
				    CASH OVERVIEW
				================================================= */}

                <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-5">

                        <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                                <MdTrendingUp className="text-2xl text-emerald-400" />
                            </div>

                            <div>

                                <p className="text-xs text-slate-500 uppercase tracking-wider">
                                    Revenue
                                </p>

                                <p className="text-2xl font-black text-emerald-300">
                                    ৳ {totalRevenue.toLocaleString()}
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="rounded-2xl border border-red-400/15 bg-red-400/[0.04] p-5">

                        <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-red-400/10 flex items-center justify-center">
                                <MdTrendingDown className="text-2xl text-red-400" />
                            </div>

                            <div>

                                <p className="text-xs text-slate-500 uppercase tracking-wider">
                                    Expenses
                                </p>

                                <p className="text-2xl font-black text-red-300">
                                    ৳ {expenses.toLocaleString()}
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] p-5">

                        <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                                <MdAccountBalanceWallet className="text-2xl text-cyan-400" />
                            </div>

                            <div>

                                <p className="text-xs text-slate-500 uppercase tracking-wider">
                                    Balance
                                </p>

                                <p
                                    className={`text-2xl font-black ${totalCash < 0
                                        ? 'text-red-300'
                                        : 'text-cyan-300'
                                        }`}
                                >
                                    ৳ {totalCash.toLocaleString()}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
				    TABS
				================================================= */}

                <div className="flex p-1 rounded-2xl bg-white/[0.03] border border-white/10 mb-6 max-w-md">

                    <button
                        onClick={() => setTab('revenue')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${tab === 'revenue'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/20'
                            : 'text-slate-500 hover:text-white'
                            }`}
                    >
                        Revenues
                    </button>

                    <button
                        onClick={() => setTab('expense')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${tab === 'expense'
                            ? 'bg-red-500/15 text-red-300 border border-red-400/20'
                            : 'text-slate-500 hover:text-white'
                            }`}
                    >
                        Expenses
                    </button>

                </div>


                {/* =================================================
				    REVENUE
				================================================= */}

                {tab === 'revenue' && (

                    <div className="rounded-3xl border border-emerald-400/15 bg-white/[0.025] overflow-hidden">

                        <div className="p-6 border-b border-white/5">

                            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">
                                Revenue Entry
                            </p>

                            <h2 className="text-xl font-bold text-white mt-1">
                                Add Daily Revenue
                            </h2>

                            <p className="text-sm text-slate-500 mt-2">
                                {currentDate}
                            </p>

                        </div>


                        <div className="p-6">

                            {loading ? (

                                <div className="h-64 flex items-center justify-center">
                                    <PuffLoader color="#34d399" />
                                </div>

                            ) : (

                                <div className="grid md:grid-cols-2 gap-5">

                                    {/* Amount */}

                                    <div>

                                        <label className="text-sm text-slate-400">
                                            Transaction Amount
                                        </label>

                                        <NumberFormatBase
                                            value={rvAmount}
                                            onValueChange={values =>
                                                setRvAmount(values.value)
                                            }
                                            className="mt-2 w-full h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white outline-none focus:border-emerald-400/40"
                                            placeholder="Enter amount"
                                            thousandSeparator={true}
                                            allowNegative={false}
                                            isNumericString={true}
                                        />

                                    </div>


                                    {/* Category */}

                                    <div>

                                        <label className="text-sm text-slate-400">
                                            Category
                                        </label>

                                        <select
                                            ref={revenueCategoryRef}
                                            value={rvCategory}
                                            onChange={e =>
                                                setRvCategory(e.target.value)
                                            }
                                            className="mt-2 w-full h-12 rounded-xl bg-[#10231f] border border-white/10 px-4 text-white outline-none"
                                        >

                                            <option value="">
                                                Select category
                                            </option>

                                            <option value="Computer">
                                                Computer
                                            </option>

                                            <option value="Stationary">
                                                Stationary
                                            </option>

                                            <option value="Photocopy">
                                                Photocopy
                                            </option>

                                            <option value="Others">
                                                Others
                                            </option>

                                        </select>

                                    </div>


                                    {/* Others comment */}

                                    {rvCategory === 'Others' && (

                                        <div className="md:col-span-2">

                                            <label className="text-sm text-slate-400">
                                                Description
                                            </label>

                                            <input
                                                ref={revenueCommentRef}
                                                type="text"
                                                className="mt-2 w-full h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white outline-none focus:border-emerald-400/40"
                                                placeholder="What is this revenue for?"
                                            />

                                        </div>

                                    )}


                                    {/* Submit */}

                                    <div className="md:col-span-2 flex justify-end">

                                        <button
                                            onClick={handleRevenueTransections}
                                            className="px-7 py-3 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500 hover:text-[#071311] font-bold transition-all"
                                        >
                                            Add Revenue
                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>

                    </div>

                )}


                {/* =================================================
				    EXPENSE
				================================================= */}

                {tab === 'expense' && (

                    <div className="rounded-3xl border border-red-400/15 bg-white/[0.025] overflow-hidden">

                        <div className="p-6 border-b border-white/5">

                            <p className="text-xs uppercase tracking-[0.25em] text-red-400">
                                Expense Entry
                            </p>

                            <h2 className="text-xl font-bold text-white mt-1">
                                Add Daily Expense
                            </h2>

                            <p className="text-sm text-slate-500 mt-2">
                                {currentDate}
                            </p>

                        </div>


                        <div className="p-6">

                            {loading ? (

                                <div className="h-64 flex items-center justify-center">
                                    <PuffLoader color="#f87171" />
                                </div>

                            ) : (

                                <div className="grid md:grid-cols-2 gap-5">

                                    {/* Amount */}

                                    <div>

                                        <label className="text-sm text-slate-400">
                                            Expense Amount
                                        </label>

                                        <NumberFormatBase
                                            value={exAmount}
                                            onValueChange={values =>
                                                setExAmount(values.value)
                                            }
                                            className="mt-2 w-full h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white outline-none focus:border-red-400/40"
                                            placeholder="Enter amount"
                                            thousandSeparator={true}
                                            allowNegative={false}
                                            isNumericString={true}
                                        />

                                    </div>


                                    {/* Comment */}

                                    <div>

                                        <label className="text-sm text-slate-400">
                                            Description
                                        </label>

                                        <input
                                            ref={expenseCommentRef}
                                            type="text"
                                            className="mt-2 w-full h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-white outline-none focus:border-red-400/40"
                                            placeholder="What is this expense for?"
                                        />

                                    </div>


                                    {/* Submit */}

                                    <div className="md:col-span-2 flex justify-end">

                                        <button
                                            onClick={handleExpenseTransections}
                                            className="px-7 py-3 rounded-xl bg-red-500/15 border border-red-400/30 text-red-300 hover:bg-red-500 hover:text-white font-bold transition-all"
                                        >
                                            Add Expense
                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>

                    </div>

                )}


                {/* =================================================
				    BREAKDOWN
				================================================= */}

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">

                    {[
                        [
                            'Computer',
                            computer,
                            'text-emerald-300'
                        ],
                        [
                            'Stationary',
                            stationary,
                            'text-cyan-300'
                        ],
                        [
                            'Photocopy',
                            photocopy,
                            'text-violet-300'
                        ],
                        [
                            'Others',
                            others,
                            'text-emerald-300'
                        ]
                    ].map(([label, value, color]) => (

                        <div
                            key={label}
                            className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
                        >

                            <p className="text-xs text-slate-500">
                                {label}
                            </p>

                            <p
                                className={`text-xl font-black mt-1 ${color}`}
                            >
                                ৳ {Number(value).toLocaleString()}
                            </p>

                        </div>

                    ))}

                </div>


                {/* =================================================
				    TOTAL SUMMARY
				================================================= */}

                <div className="mt-6 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>

                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                                Overall Summary
                            </p>

                            <p className="text-white font-bold mt-1">
                                Including previous closed days
                            </p>

                        </div>

                        <div className="text-right">

                            <p className="text-xs text-slate-500 uppercase">
                                Total Cash Movement
                            </p>

                            <p
                                className={`text-2xl font-black ${totalCash >= 0
                                    ? 'text-cyan-300'
                                    : 'text-red-300'
                                    }`}
                            >
                                ৳ {totalCash.toLocaleString()}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default DailyTransactions;