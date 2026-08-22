import React, { useEffect, useRef } from 'react';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';

const RevenueTransectionsDetials = () => {
    const shopTransections = useLoaderData();
    const {
        revenue_transections = [],
        total_revenue_amount = 0,
        month_name
    } = shopTransections[0] || {};

    const location = useLocation();
    const from = location?.state?.pathname;
    const printRef = useRef();

    const handlePrint = () => {
        const contents = printRef.current.innerHTML;
        const iframe = document.createElement('iframe');

        iframe.style.cssText =
            'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';

        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;

        doc.open();
        doc.write(`
            <html>
                <head>
                    <title>Revenue Transactions - ${month_name}</title>
                    <style>
                        @page { size: A4; margin: 18mm; }
                        body {
                            font-family: Arial, sans-serif;
                            color: #111;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 25px;
                        }
                        th, td {
                            border: 1px solid #222;
                            padding: 8px;
                            text-align: left;
                        }
                        th { background: #f1f5f9; }
                        .center { text-align: center; }
                        .right { text-align: right; }
                    </style>
                </head>
                <body>${contents}</body>
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

    return (
        <div className="min-h-full py-5 sm:py-8 text-white">
            <div className="flex items-center justify-between mb-7">
                <Link
                    to={from || '/admin'}
                    className="hidden md:block px-4 py-2 rounded-xl border border-white/10
                    bg-white/[0.03] text-slate-300 hover:text-emerald-300
                    hover:border-emerald-400/30 transition"
                >
                    ← Back
                </Link>

                <button
                    onClick={handlePrint}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500
                    font-semibold shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition"
                >
                    Print Report
                </button>
            </div>

            <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-400/70">
                    Revenue
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold">
                    Revenue Transactions
                </h1>
                <p className="text-slate-400 mt-1">{month_name}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] overflow-hidden p-5">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="bg-emerald-400/[0.06] border-b border-white/10">
                                <th className="px-4 py-4 text-left text-emerald-300/80">Date</th>
                                <th className="px-4 py-4 text-left text-emerald-300/80">Transaction ID</th>
                                <th className="px-4 py-4 text-left text-emerald-300/80">Explanation</th>
                                <th className="px-4 py-4 text-right text-emerald-300/80">Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {revenue_transections.map((transaction, index) => (
                                <tr
                                    key={transaction.transection_id || index}
                                    className="border-b border-white/[0.06] hover:bg-emerald-400/[0.03]"
                                >
                                    <td className="px-4 py-4 text-slate-300">
                                        {transaction.transection_date}
                                    </td>
                                    <td className="px-4 py-4 text-cyan-300">
                                        {transaction.transection_id}
                                    </td>
                                    <td className="px-4 py-4 text-slate-300">
                                        {transaction.transection_explaination || '—'}
                                    </td>
                                    <td className="px-4 py-4 text-right text-emerald-300 font-semibold">
                                        ৳ {transaction.transection_amount}
                                    </td>
                                </tr>
                            ))}

                            <tr className="bg-emerald-400/[0.04]">
                                <td colSpan="3" className="px-4 py-4 text-right font-bold text-white">
                                    Total Revenue
                                </td>
                                <td className="px-4 py-4 text-right font-bold text-emerald-300">
                                    ৳ {total_revenue_amount}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Print content */}
            <div ref={printRef} className="hidden">
                <div style={{ textAlign: 'center' }}>
                    <h1>BISMILLAH ENTERPRISE</h1>
                    <p>Revenue Transaction Details — {month_name}</p>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Transaction ID</th>
                            <th>Explanation</th>
                            <th>Amount</th>
                        </tr>
                    </thead>

                    <tbody>
                        {revenue_transections.map((transaction, index) => (
                            <tr key={index}>
                                <td>{transaction.transection_date}</td>
                                <td>{transaction.transection_id}</td>
                                <td>{transaction.transection_explaination || '—'}</td>
                                <td>{transaction.transection_amount}</td>
                            </tr>
                        ))}

                        <tr>
                            <th colSpan="3" className="right">Total Revenue</th>
                            <th>{total_revenue_amount}</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RevenueTransectionsDetials;
