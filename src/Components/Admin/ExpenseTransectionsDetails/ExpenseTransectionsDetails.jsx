import React, { useRef } from 'react';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';

const ExpenseTransectionsDetails = () => {
    const shopTransections = useLoaderData();
    const { expense_transections, total_expense_amount, month_name } = shopTransections[0];
    const location = useLocation();
    const from = location?.state?.pathname;
    const navigate = useNavigate();


    const expenseTransectionsPrintRef = useRef();

    const handlePrint = () => {
        const printContents = expenseTransectionsPrintRef.current.innerHTML;
        // Create a hidden iframe
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';

        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;

        // Optional: You can load Tailwind CSS from CDN inside iframe
        doc.open();
        doc.write(`
      <html>
                <head>
                    <title>Expense Transactions - ${month_name}</title>
                    <style>
                        @page {
                            size: A4;
                            margin: 15mm;
                        }

                        * {
                            box-sizing: border-box;
                        }

                        body {
                            font-family: Arial, sans-serif;
                            color: #111;
                            margin: 0;
                        }

                        .print-container {
                            width: 100%;
                        }

                        .header {
                            text-align: center;
                            margin-bottom: 20px;
                        }

                        .header h1 {
                            font-size: 26px;
                            margin: 0 0 12px;
                        }

                        .logo {
                            width: 70px;
                            height: 70px;
                            object-fit: contain;
                            margin-bottom: 10px;
                        }

                        .title {
                            display: inline-block;
                            border: 1px solid #222;
                            border-radius: 6px;
                            padding: 8px 18px;
                            font-size: 17px;
                            font-weight: 700;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                            font-size: 12px;
                        }

                        th,
                        td {
                            border: 1px solid #222;
                            padding: 8px;
                            text-align: left;
                        }

                        th {
                            background: #f1f1f1;
                        }

                        .amount {
                            text-align: right;
                        }

                        .total-row td {
                            font-weight: 700;
                        }
                    </style>
                </head>

                <body>
                    ${printContents}
                </body>
            </html>
    `);
        doc.close();

        // Wait until iframe is ready then print
        iframe.onload = () => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();

            // Optional: Cleanup after printing
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        };

    };
    return (
        <div className="min-h-full pb-12 text-white">

            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-400/10 bg-[#0a1a17]/80 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-7">

                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

                <div className="relative z-10 flex items-center gap-4">

                    <Link to={from}>
                        <button className="hidden md:flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-sm font-semibold text-emerald-100 transition-all hover:border-emerald-300/40 hover:bg-emerald-400/10">
                            ← Back
                        </button>
                    </Link>

                    <div className="flex-1 text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400/70">
                            Expense Report
                        </p>

                        <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                            {month_name}
                        </h1>

                        <p className="mt-1 text-xs text-slate-500">
                            Complete expense transaction details
                        </p>
                    </div>

                    <div className="hidden w-[72px] md:block" />
                </div>

                <div className="relative z-10 mt-6 rounded-2xl border border-violet-400/10 bg-violet-400/[0.035] p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                        Total Expense
                    </p>

                    <p className="mt-1 text-2xl font-bold text-violet-300">
                        {Number(total_expense_amount).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="mt-7 overflow-hidden rounded-3xl border border-emerald-400/10 bg-[#081714]/80 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl p-5">

                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full min-w-[700px] text-sm">

                        <thead>
                            <tr className="border-b border-emerald-400/10 bg-emerald-400/[0.035]">
                                <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-emerald-300/80">
                                    Date
                                </th>

                                <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-emerald-300/80">
                                    Transaction ID
                                </th>

                                <th className="px-5 py-4 text-left text-xs uppercase tracking-wider text-emerald-300/80">
                                    Explanation
                                </th>

                                <th className="px-5 py-4 text-right text-xs uppercase tracking-wider text-emerald-300/80">
                                    Amount
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {expense_transections.length > 0 ? (
                                expense_transections.map((transaction, index) => (
                                    <tr
                                        key={`${transaction?.transection_id}-${index}`}
                                        className="border-b border-white/[0.035] transition-colors hover:bg-emerald-400/[0.025]"
                                    >
                                        <td className="px-5 py-4 text-slate-300">
                                            {transaction?.transection_date}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.04] px-3 py-1 text-cyan-300">
                                                {transaction?.transection_id}
                                            </span>
                                        </td>

                                        <td className="max-w-[420px] px-5 py-4 text-slate-300">
                                            {transaction?.transection_explaination}
                                        </td>

                                        <td className="px-5 py-4 text-right font-semibold text-violet-300">
                                            {Number(transaction?.transection_amount || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-5 py-16 text-center text-slate-500"
                                    >
                                        No expense transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                        {expense_transections.length > 0 && (
                            <tfoot>
                                <tr className="bg-white/[0.015]">
                                    <td colSpan="2" />

                                    <td className="px-5 py-5 text-right font-bold text-white">
                                        Total Expense Amount
                                    </td>

                                    <td className="px-5 py-5 text-right text-lg font-bold text-violet-300">
                                        {Number(total_expense_amount).toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        )}

                    </table>
                </div>
            </div>

            {/* Print */}
            <div className="mt-7 flex justify-center">
                <button
                    onClick={handlePrint}
                    className="group flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-6 py-3 font-semibold text-emerald-200 transition-all duration-300 hover:border-emerald-300/40 hover:bg-emerald-400/10 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]"
                >
                    <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
                        🖨
                    </span>
                    Print Report
                </button>
            </div>

            {/* Print document */}
            <div
                ref={expenseTransectionsPrintRef}
                className="hidden"
            >
                <div className="print-container">

                    <div className="header">
                        <h1>BISMILLAH ENTERPRISE</h1>
                        <div className="title">
                            Expense Transaction Details of {month_name}
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Transaction ID</th>
                                <th>Transaction Explanation</th>
                                <th className="amount">Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {expense_transections.map((transaction, index) => (
                                <tr key={`${transaction?.transection_id}-${index}`}>
                                    <td>{transaction?.transection_date}</td>
                                    <td>{transaction?.transection_id}</td>
                                    <td>{transaction?.transection_explaination}</td>
                                    <td className="amount">
                                        {Number(transaction?.transection_amount || 0).toFixed(2)}
                                    </td>
                                </tr>
                            ))}

                            <tr className="total-row">
                                <td colSpan="3">Total Expense Amount</td>
                                <td className="amount">
                                    {Number(total_expense_amount).toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExpenseTransectionsDetails;