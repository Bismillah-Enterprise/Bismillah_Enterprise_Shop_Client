import React, { useEffect, useRef, useState } from 'react';
import {
    MdOutlineCancel,
    MdCalendarMonth,
    MdPrint,
    MdDeleteOutline
} from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loading from '../../Shared/Loading/Loading';

const ViewDailyTransactions = () => {
    const [loadedTransactions, setLoadedTransactions] = useState([]);
    const [allTRX, setAllTRX] = useState([]);
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState([]);
    const [reload, setReload] = useState(false);

    const navigate = useNavigate();
    const voucherPrintRef = useRef();

    useEffect(() => {
        fetch(`https://bismillah-enterprise-server.onrender.com/daily_transactions`)
            .then(res => res.json())
            .then(data => {
                setLoadedTransactions(data);
                setAllTRX(data?.summary || []);
            })
            .catch(error => {
                console.error('Failed to load daily transactions:', error);
            });
    }, [reload]);

    // Convert YYYY-MM-DD into readable date
    const formatDate = value => {
        if (!value) return "";

        const date = new Date(`${value}T00:00:00`);

        return new Intl.DateTimeFormat('en-US', {
            day: 'numeric',
            year: 'numeric',
            month: 'long'
        }).format(date);
    };

    // Date filter
    const handleDateChange = (value, category) => {
        if (!value) return;

        if (category === 'start') {
            setSelectedStartDate(value);

            const startDate = new Date(`${value}T00:00:00`);

            const filteredData = (loadedTransactions?.summary || []).filter(
                item => {
                    if (!item?.date) return false;

                    const itemDate = new Date(item.date);
                    itemDate.setHours(0, 0, 0, 0);

                    return itemDate >= startDate;
                }
            );

            setAllTRX(filteredData);

            return;
        }

        // End date cannot be selected before start date
        if (!selectedStartDate) {
            Swal.fire({
                icon: "warning",
                title: "Select Start Date First",
                showConfirmButton: false,
                timer: 1200,
                background: "#0b1c18",
                color: "#e2e8f0"
            });

            return;
        }

        const startDate = new Date(`${selectedStartDate}T00:00:00`);
        const endDate = new Date(`${value}T23:59:59`);

        if (endDate < startDate) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Date Range",
                text: "End date cannot be earlier than start date.",
                showConfirmButton: false,
                timer: 1500,
                background: "#0b1c18",
                color: "#e2e8f0"
            });

            return;
        }

        setSelectedEndDate(value);

        const filteredData = (loadedTransactions?.summary || []).filter(
            item => {
                if (!item?.date) return false;

                const itemDate = new Date(item.date);
                itemDate.setHours(0, 0, 0, 0);

                return itemDate >= startDate && itemDate <= endDate;
            }
        );

        setAllTRX(filteredData);
    };

    // Clear date filter
    const clearFilter = () => {
        setSelectedStartDate("");
        setSelectedEndDate("");
        setAllTRX(loadedTransactions?.summary || []);
    };

    const openDetails = (date, data) => {
        setDetails(data || []);
        setModal(true);
    };

    const handleClose = () => {
        Swal.fire({
            title: "Close Today's Transactions?",
            text: "Make sure all transactions have been entered.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#64748b",
            background: "#0b1c18",
            color: "#e2e8f0",
            confirmButtonText: "Close Transactions"
        }).then(result => {
            if (!result.isConfirmed) return;

            fetch(`https://bismillah-enterprise-server.onrender.com/daily_transactions`)
                .then(res => res.json())
                .then(data => {
                    const expense_summary = {
                        date: data?.date,

                        computer_revenues:
                            data?.computer_revenues,

                        stationary_revenues:
                            data?.stationary_revenues,

                        photocopy_revenues:
                            data?.photocopy_revenues,

                        others_revenues: {
                            amounts:
                                data?.others_revenues?.map(
                                    item => item.amount
                                ) || [],

                            descriptions:
                                data?.others_revenues?.map(
                                    item => item.comment
                                ) || []
                        },

                        expenses: {
                            amounts:
                                data?.expenses?.map(
                                    item => item.amount
                                ) || [],

                            descriptions:
                                data?.expenses?.map(
                                    item => item.comment
                                ) || []
                        }
                    };

                    return fetch(
                        `https://bismillah-enterprise-server.onrender.com/close_daily_transactions`,
                        {
                            method: 'PATCH',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify(expense_summary)
                        }
                    );
                })
                .then(res => res.json())
                .then(() => {
                    Swal.fire({
                        icon: "success",
                        title: "Transactions Closed",
                        showConfirmButton: false,
                        timer: 1000,
                        background: "#0b1c18",
                        color: "#e2e8f0"
                    });

                    setReload(value => !value);
                })
                .catch(error => {
                    console.error('Failed to close transactions:', error);

                    Swal.fire({
                        icon: "error",
                        title: "Something went wrong",
                        text: "Could not close today's transactions.",
                        background: "#0b1c18",
                        color: "#e2e8f0"
                    });
                });
        });
    };

    const handleDelete = (startDate, endDate) => {
        if (!startDate || !endDate) {
            Swal.fire({
                icon: "warning",
                title: "No Data Selected",
                text: "Please select a date range first.",
                showConfirmButton: false,
                timer: 1500,
                background: "#0b1c18",
                color: "#e2e8f0"
            });

            return;
        }

        Swal.fire({
            title: "Delete Transactions?",
            text: `Delete data from ${startDate} to ${endDate}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            background: "#0b1c18",
            color: "#e2e8f0",
            confirmButtonText: "Delete"
        }).then(result => {
            if (!result.isConfirmed) return;

            setLoading(true);

            fetch("https://bismillah-enterprise-server.onrender.com/delete_summary", {
                method: "PATCH",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    startDate,
                    endDate
                })
            })
                .then(res => res.json())
                .then(() => {
                    Swal.fire({
                        icon: "success",
                        title: "Transactions Deleted",
                        showConfirmButton: false,
                        timer: 1000,
                        background: "#0b1c18",
                        color: "#e2e8f0"
                    });

                    setSelectedStartDate("");
                    setSelectedEndDate("");
                    setLoading(false);
                    setReload(value => !value);
                })
                .catch(error => {
                    console.error('Failed to delete transactions:', error);

                    setLoading(false);

                    Swal.fire({
                        icon: "error",
                        title: "Delete Failed",
                        text: "Could not delete the selected transactions.",
                        background: "#0b1c18",
                        color: "#e2e8f0"
                    });
                });
        });
    };

    const handlePrint = () => {
        const content = voucherPrintRef.current.innerHTML;

        const iframe = document.createElement('iframe');

        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';

        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;

        doc.open();

        doc.write(`
            <html>
                <head>
                    <title>Accounts Record</title>

                    <style>
                        @page {
                            size: A4;
                            margin: 8mm;
                        }

                        body {
                            font-family: Arial, sans-serif;
                            color: #000;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }

                        th,
                        td {
                            border: 1px solid #000;
                            padding: 7px;
                            text-align: center;
                        }

                        th {
                            font-weight: 700;
                        }
                    </style>
                </head>

                <body>
                    ${content}
                </body>
            </html>
        `);

        doc.close();

        iframe.onload = () => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();

            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        };
    };

    // Today's cash
    const todayCash =
        (loadedTransactions?.others_revenues || []).reduce(
            (sum, item) =>
                sum + (Number(item?.amount) || 0),
            0
        ) +
        (Number(loadedTransactions?.photocopy_revenues) || 0) +
        (Number(loadedTransactions?.stationary_revenues) || 0) +
        (Number(loadedTransactions?.computer_revenues) || 0) -
        (loadedTransactions?.expenses || []).reduce(
            (sum, item) =>
                sum + (Number(item?.amount) || 0),
            0
        );

    // Total Computer
    const totalComputer =
        (allTRX || []).reduce(
            (sum, item) =>
                sum + (Number(item?.computer_revenues) || 0),
            0
        ) +
        (Number(loadedTransactions?.computer_revenues) || 0);

    // Total Stationary
    const totalStationary =
        (allTRX || []).reduce(
            (sum, item) =>
                sum + (Number(item?.stationary_revenues) || 0),
            0
        ) +
        (Number(loadedTransactions?.stationary_revenues) || 0);

    // Total Photocopy
    const totalPhotocopy =
        (allTRX || []).reduce(
            (sum, item) =>
                sum + (Number(item?.photocopy_revenues) || 0),
            0
        ) +
        (Number(loadedTransactions?.photocopy_revenues) || 0);

    // Total Others
    const totalOthers =
        (allTRX || []).reduce(
            (sum, item) =>
                sum +
                (item?.others_revenues?.amounts || []).reduce(
                    (s, i) => s + (Number(i) || 0),
                    0
                ),
            0
        ) +
        (loadedTransactions?.others_revenues || []).reduce(
            (sum, item) =>
                sum + (Number(item?.amount) || 0),
            0
        );

    // Total Expenses
    const totalExpenses =
        (allTRX || []).reduce(
            (sum, item) =>
                sum +
                (item?.expenses?.amounts || []).reduce(
                    (s, i) => s + (Number(i) || 0),
                    0
                ),
            0
        ) +
        (loadedTransactions?.expenses || []).reduce(
            (sum, item) =>
                sum + (Number(item?.amount) || 0),
            0
        );

    // Total Cash
    const totalCash =
        totalComputer +
        totalStationary +
        totalPhotocopy +
        totalOthers -
        totalExpenses;

    /*
        Delete range

        If user selected a range,
        use that range.

        Otherwise use available summary dates.
    */
    const deleteStartDate =
        selectedStartDate ||
        allTRX?.[allTRX.length - 1]?.date;

    const deleteEndDate =
        selectedEndDate ||
        allTRX?.[0]?.date;

    return (
        <div className="min-h-full relative pb-12 text-slate-200">

            {/* Ambient Background */}
            <div className="pointer-events-none fixed -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-[140px]" />

            <div className="pointer-events-none fixed top-[30%] -right-40 w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[140px]" />

            <div className="pointer-events-none fixed -bottom-40 left-[35%] w-[450px] h-[450px] rounded-full bg-violet-500/10 blur-[150px]" />

            {/* ================= MODAL ================= */}
            {modal && (
                <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">

                    <div className="w-full max-w-xl rounded-3xl border border-cyan-400/20 bg-[#0b1c18]/95 shadow-2xl shadow-cyan-500/10">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">

                            <div>
                                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                                    Details
                                </p>

                                <h2 className="text-xl font-bold text-white">
                                    Transaction Breakdown
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setModal(false)}
                            >
                                <MdOutlineCancel className="text-2xl text-slate-400 hover:text-red-400" />
                            </button>

                        </div>

                        {/* Modal Body */}
                        <div className="max-h-[420px] overflow-y-auto p-5 scrollbar-hide">

                            <table className="w-full text-sm">

                                <thead>
                                    <tr className="border-b border-white/10 text-slate-500">

                                        <th className="text-left py-3">
                                            #
                                        </th>

                                        <th className="text-left py-3">
                                            Description
                                        </th>

                                        <th className="text-right py-3">
                                            Amount
                                        </th>

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

                                            <td className="py-3 text-right text-cyan-300 font-bold">
                                                {item?.amount}
                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                                <tfoot>

                                    <tr>

                                        <td />

                                        <td className="py-4 font-bold">
                                            Total
                                        </td>

                                        <td className="py-4 text-right font-black text-emerald-300">
                                            {details?.reduce(
                                                (sum, item) =>
                                                    sum +
                                                    (Number(item?.amount) || 0),
                                                0
                                            )}
                                        </td>

                                    </tr>

                                </tfoot>

                            </table>

                        </div>

                    </div>

                </div>
            )}

            {/* ================= MAIN ================= */}

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">

                    <div>

                        <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
                            Analytics
                        </p>

                        <h1 className="text-3xl md:text-4xl font-black text-white mt-1">
                            View Daily Transactions
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Review historical cash flow and daily records.
                        </p>

                    </div>

                    <Link
                        to="/"
                        className="w-fit px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-emerald-400/30 hover:text-emerald-300 transition-all"
                    >
                        Back
                    </Link>

                </div>

                {/* ================= STATS ================= */}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">

                    {[
                        [
                            'Revenue',
                            totalComputer +
                            totalStationary +
                            totalPhotocopy +
                            totalOthers,
                            'text-emerald-300'
                        ],

                        [
                            'Expenses',
                            totalExpenses,
                            'text-red-300'
                        ],

                        [
                            'Cash',
                            totalCash,
                            totalCash < 0
                                ? 'text-red-300'
                                : 'text-cyan-300'
                        ],

                        [
                            'Days',
                            allTRX?.length || 0,
                            'text-violet-300'
                        ]

                    ].map(([label, value, color]) => (

                        <div
                            key={label}
                            className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
                        >

                            <p className="text-xs text-slate-500 uppercase tracking-wider">
                                {label}
                            </p>

                            <p
                                className={`text-xl md:text-2xl font-black mt-1 ${color}`}
                            >
                                {value}
                            </p>

                        </div>

                    ))}

                </div>

                {/* ================= FILTER ================= */}

                <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 mb-6">

                    <div className="flex items-center gap-2 mb-4">

                        <MdCalendarMonth className="text-emerald-400 text-xl" />

                        <h2 className="font-bold text-white">
                            Date Filter
                        </h2>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

                        {/* START DATE */}

                        <div className="min-w-0">

                            <label className="block">

                                <span className="text-xs text-slate-500">
                                    Show From
                                </span>

                                <input
                                    type="date"
                                    value={selectedStartDate}
                                    onChange={e =>
                                        handleDateChange(
                                            e.target.value,
                                            'start'
                                        )
                                    }
                                    className="mt-2 w-full h-11 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-white outline-none focus:border-emerald-400/40"
                                />

                            </label>

                            {/* Fixed height */}
                            <div className="h-5 mt-1">

                                {selectedStartDate && (
                                    <p className="text-xs text-emerald-400 truncate">
                                        {formatDate(selectedStartDate)}
                                    </p>
                                )}

                            </div>

                        </div>

                        {/* END DATE */}

                        <div className="min-w-0">

                            <label className="block">

                                <span className="text-xs text-slate-500">
                                    Show To
                                </span>

                                <input
                                    type="date"
                                    value={selectedEndDate}
                                    onChange={e =>
                                        handleDateChange(
                                            e.target.value,
                                            'end'
                                        )
                                    }
                                    className="mt-2 w-full h-11 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-white outline-none focus:border-cyan-400/40"
                                />

                            </label>

                            {/* Fixed height */}
                            <div className="h-5 mt-1">

                                {selectedEndDate && (
                                    <p className="text-xs text-cyan-400 truncate">
                                        {formatDate(selectedEndDate)}
                                    </p>
                                )}

                            </div>

                        </div>

                        {/* CLEAR FILTER */}

                        <div className="w-full">

                            <button
                                type="button"
                                onClick={clearFilter}
                                className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.03] hover:border-cyan-400/30 hover:text-cyan-300 font-semibold transition-all"
                            >
                                Clear Filter
                            </button>

                        </div>

                    </div>

                </div>

                {/* ================= TABLE ================= */}

                {loading ? (

                    <div className="py-20 flex justify-center">
                        <Loading />
                    </div>

                ) : (

                    <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] overflow-hidden p-5">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[850px] text-sm">

                                <thead>

                                    <tr className="bg-white/[0.03] border-b border-white/10 text-slate-500">

                                        {[
                                            'Date',
                                            'Computer',
                                            'Stationary',
                                            'Photocopy',
                                            'Others',
                                            'Expenses',
                                            'Cash'
                                        ].map(item => (

                                            <th
                                                key={item}
                                                className="text-left px-5 py-4"
                                            >
                                                {item}
                                            </th>

                                        ))}

                                    </tr>

                                </thead>

                                <tbody>

                                    {/* CURRENT DAY */}

                                    {loadedTransactions &&
                                        (
                                            loadedTransactions?.computer_revenues ||
                                            loadedTransactions?.stationary_revenues ||
                                            loadedTransactions?.photocopy_revenues ||
                                            loadedTransactions?.others_revenues?.length ||
                                            loadedTransactions?.expenses?.length
                                        ) ? (

                                        <tr className="border-b border-white/5 bg-emerald-400/[0.025]">

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-2">

                                                    <span className="text-emerald-300">
                                                        {loadedTransactions?.date}
                                                    </span>

                                                    <button
                                                        onClick={handleClose}
                                                        className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs hover:bg-emerald-500 hover:text-[#071311]"
                                                    >
                                                        Close
                                                    </button>

                                                </div>

                                            </td>

                                            <td className="px-5 py-4 text-emerald-300">
                                                {loadedTransactions?.computer_revenues || 0}
                                            </td>

                                            <td className="px-5 py-4 text-emerald-300">
                                                {loadedTransactions?.stationary_revenues || 0}
                                            </td>

                                            <td className="px-5 py-4 text-emerald-300">
                                                {loadedTransactions?.photocopy_revenues || 0}
                                            </td>

                                            <td
                                                onClick={() =>
                                                    openDetails(
                                                        loadedTransactions?.date,
                                                        loadedTransactions?.others_revenues
                                                    )
                                                }
                                                className="px-5 py-4 text-emerald-300 underline cursor-pointer"
                                            >

                                                {(loadedTransactions?.others_revenues || []).reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        (Number(item?.amount) || 0),
                                                    0
                                                )}

                                            </td>

                                            <td
                                                onClick={() =>
                                                    openDetails(
                                                        loadedTransactions?.date,
                                                        loadedTransactions?.expenses
                                                    )
                                                }
                                                className="px-5 py-4 text-red-300 underline cursor-pointer"
                                            >

                                                {(loadedTransactions?.expenses || []).reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        (Number(item?.amount) || 0),
                                                    0
                                                )}

                                            </td>

                                            <td
                                                className={`px-5 py-4 font-black ${todayCash < 0
                                                        ? 'text-red-300'
                                                        : 'text-cyan-300'
                                                    }`}
                                            >
                                                {todayCash}
                                            </td>

                                        </tr>

                                    ) : null}

                                    {/* SUMMARY */}

                                    {allTRX?.map((item, index) => {

                                        const others =
                                            (item?.others_revenues?.amounts || [])
                                                .reduce(
                                                    (sum, i) =>
                                                        sum +
                                                        (Number(i) || 0),
                                                    0
                                                );

                                        const expenses =
                                            (item?.expenses?.amounts || [])
                                                .reduce(
                                                    (sum, i) =>
                                                        sum +
                                                        (Number(i) || 0),
                                                    0
                                                );

                                        const cash =
                                            (Number(item?.computer_revenues) || 0) +
                                            (Number(item?.stationary_revenues) || 0) +
                                            (Number(item?.photocopy_revenues) || 0) +
                                            others -
                                            expenses;

                                        const othersWithDescription =
                                            (item?.others_revenues?.amounts || [])
                                                .map((amount, i) => ({
                                                    amount,

                                                    comment:
                                                        item
                                                            ?.others_revenues
                                                            ?.descriptions?.[i]
                                                }));

                                        const expensesWithDescription =
                                            (item?.expenses?.amounts || [])
                                                .map((amount, i) => ({
                                                    amount,

                                                    comment:
                                                        item
                                                            ?.expenses
                                                            ?.descriptions?.[i]
                                                }));

                                        return (

                                            <tr
                                                key={index}
                                                className="border-b border-white/5 hover:bg-white/[0.025]"
                                            >

                                                <td className="px-5 py-4 text-white">
                                                    {item?.date}
                                                </td>

                                                <td className="px-5 py-4">
                                                    {item?.computer_revenues || 0}
                                                </td>

                                                <td className="px-5 py-4">
                                                    {item?.stationary_revenues || 0}
                                                </td>

                                                <td className="px-5 py-4">
                                                    {item?.photocopy_revenues || 0}
                                                </td>

                                                <td
                                                    onClick={() =>
                                                        openDetails(
                                                            item?.date,
                                                            othersWithDescription
                                                        )
                                                    }
                                                    className="px-5 py-4 text-emerald-300 underline cursor-pointer"
                                                >
                                                    {others}
                                                </td>

                                                <td
                                                    onClick={() =>
                                                        openDetails(
                                                            item?.date,
                                                            expensesWithDescription
                                                        )
                                                    }
                                                    className="px-5 py-4 text-red-300 underline cursor-pointer"
                                                >
                                                    {expenses}
                                                </td>

                                                <td
                                                    className={`px-5 py-4 font-black ${cash < 0
                                                            ? 'text-red-300'
                                                            : 'text-cyan-300'
                                                        }`}
                                                >
                                                    {cash}
                                                </td>

                                            </tr>

                                        );
                                    })}

                                </tbody>

                                {/* TOTAL */}

                                <tfoot>

                                    <tr className="bg-white/[0.03] font-black">

                                        <td className="px-5 py-4 text-white">
                                            Total
                                        </td>

                                        <td className="px-5 py-4 text-emerald-300">
                                            {totalComputer}
                                        </td>

                                        <td className="px-5 py-4 text-emerald-300">
                                            {totalStationary}
                                        </td>

                                        <td className="px-5 py-4 text-emerald-300">
                                            {totalPhotocopy}
                                        </td>

                                        <td className="px-5 py-4 text-emerald-300">
                                            {totalOthers}
                                        </td>

                                        <td className="px-5 py-4 text-red-300">
                                            {totalExpenses}
                                        </td>

                                        <td
                                            className={`px-5 py-4 ${totalCash < 0
                                                    ? 'text-red-300'
                                                    : 'text-cyan-300'
                                                }`}
                                        >
                                            {totalCash}
                                        </td>

                                    </tr>

                                </tfoot>

                            </table>

                        </div>

                    </div>

                )}

                {/* ================= ACTIONS ================= */}

                <div className="flex flex-wrap justify-center gap-3 mt-6">

                    <button
                        onClick={() =>
                            handleDelete(
                                deleteStartDate,
                                deleteEndDate
                            )
                        }
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-400/20 text-red-300 hover:bg-red-500 hover:text-white font-semibold transition-all"
                    >
                        <MdDeleteOutline />

                        Delete Data
                    </button>

                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 hover:bg-cyan-500 hover:text-[#071311] font-semibold transition-all"
                    >
                        <MdPrint />

                        Print
                    </button>

                </div>

                {/* ================= PRINT CONTENT ================= */}

                <div
                    ref={voucherPrintRef}
                    className="hidden"
                >

                    <h1
                        style={{
                            textAlign: 'center',
                            marginBottom: '20px'
                        }}
                    >
                        Accounts Record
                    </h1>

                    <p style={{ textAlign: 'center' }}>

                        {selectedStartDate
                            ? formatDate(selectedStartDate)
                            : allTRX?.[0]?.date}

                        {" - "}

                        {selectedEndDate
                            ? formatDate(selectedEndDate)
                            : allTRX?.[allTRX.length - 1]?.date}

                    </p>

                    <table>

                        <thead>

                            <tr>

                                <th>Date</th>
                                <th>Computer</th>
                                <th>Stationary</th>
                                <th>Photocopy</th>
                                <th>Others</th>
                                <th>Expenses</th>
                                <th>Cash</th>

                            </tr>

                        </thead>

                        <tbody>

                            {allTRX?.map((item, index) => {

                                const others =
                                    (item?.others_revenues?.amounts || [])
                                        .reduce(
                                            (sum, i) =>
                                                sum +
                                                (Number(i) || 0),
                                            0
                                        );

                                const expenses =
                                    (item?.expenses?.amounts || [])
                                        .reduce(
                                            (sum, i) =>
                                                sum +
                                                (Number(i) || 0),
                                            0
                                        );

                                const cash =
                                    (Number(item?.computer_revenues) || 0) +
                                    (Number(item?.stationary_revenues) || 0) +
                                    (Number(item?.photocopy_revenues) || 0) +
                                    others -
                                    expenses;

                                return (

                                    <tr key={index}>

                                        <td>
                                            {item?.date}
                                        </td>

                                        <td>
                                            {item?.computer_revenues || 0}
                                        </td>

                                        <td>
                                            {item?.stationary_revenues || 0}
                                        </td>

                                        <td>
                                            {item?.photocopy_revenues || 0}
                                        </td>

                                        <td>
                                            {others}
                                        </td>

                                        <td>
                                            {expenses}
                                        </td>

                                        <td>
                                            {cash}
                                        </td>

                                    </tr>

                                );

                            })}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default ViewDailyTransactions;