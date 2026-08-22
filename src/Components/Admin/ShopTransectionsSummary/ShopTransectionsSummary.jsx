import React, { useMemo, useRef } from 'react';
import { FiArrowLeft, FiDollarSign, FiPrinter, FiTrendingDown, FiTrendingUp } from 'react-icons/fi';
import { Link, useLoaderData, useLocation } from 'react-router-dom';

const ShopTransectionsSummary = () => {
    const allSummary = useLoaderData() || [];
    const location = useLocation();
    const from = location?.state?.pathname;
    const summaryPrintRef = useRef();

    const totals = useMemo(
        () =>
            allSummary.reduce(
                (acc, item) => {
                    acc.revenue += Number(item.total_revenue_amount) || 0;
                    acc.expense += Number(item.total_expense_amount) || 0;
                    return acc;
                },
                { revenue: 0, expense: 0 }
            ),
        [allSummary]
    );

    const handlePrint = () => {
        const printContents = summaryPrintRef.current?.innerHTML || '';
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
          <title>BISMILLAH ENTERPRISE - Shop Transaction Summary</title>
          <style>
            @page { size: A4; margin: 18mm; }
            * { box-sizing: border-box; }
            body { font-family: Arial, sans-serif; color: #111827; margin: 0; }
            h1, h2, p { margin: 0; }
            .brand { text-align: center; margin-bottom: 22px; }
            .brand h1 { font-size: 26px; margin-bottom: 5px; }
            .brand p { color: #6b7280; font-size: 12px; }
            .title { text-align: center; border: 1px solid #d1d5db; border-radius: 10px; padding: 10px; margin-bottom: 18px; font-size: 17px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background: #f3f4f6; }
            .total td { font-weight: 700; background: #f9fafb; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
        doc.close();

        iframe.onload = () => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            setTimeout(() => document.body.removeChild(iframe), 1000);
        };
    };

    const money = (value) => `৳ ${Number(value || 0).toLocaleString()}`;

    return (
        <div className="relative min-h-full w-full px-1 py-3 sm:px-2 lg:p-5 text-slate-100">
            <div className="pointer-events-none fixed -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[130px]" />
            <div className="pointer-events-none fixed top-1/3 -right-40 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[140px]" />
            <div className="pointer-events-none fixed -bottom-48 left-[35%] h-[460px] w-[460px] rounded-full bg-violet-500/10 blur-[150px]" />

            <div className="relative mx-auto max-w-6xl">
                <div className="mb-6">
                    {from && (
                        <Link to={from} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:border-emerald-400/20 hover:text-emerald-300">
                            <FiArrowLeft /> Back
                        </Link>
                    )}
                </div>

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Financial Report</p>
                        <h1 className="text-2xl font-bold sm:text-3xl">Shop Transactions Summary</h1>
                        <p className="mt-1 text-sm text-slate-500">Last {allSummary.length} months of shop activity.</p>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition hover:-translate-y-0.5 hover:bg-cyan-400/15"
                    >
                        <FiPrinter /> Print Report
                    </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-emerald-400/10 bg-[#0b1f1b]/70 p-5 backdrop-blur-xl">
                        <FiTrendingUp className="mb-4 text-xl text-emerald-300" />
                        <p className="text-xs uppercase tracking-wider text-slate-500">Combined Revenue</p>
                        <p className="mt-2 text-2xl font-bold text-white">{money(totals.revenue)}</p>
                    </div>
                    <div className="rounded-2xl border border-violet-400/10 bg-[#0b1f1b]/70 p-5 backdrop-blur-xl">
                        <FiTrendingDown className="mb-4 text-xl text-violet-300" />
                        <p className="text-xs uppercase tracking-wider text-slate-500">Combined Expense</p>
                        <p className="mt-2 text-2xl font-bold text-white">{money(totals.expense)}</p>
                    </div>
                    <div className="rounded-2xl border border-cyan-400/10 bg-[#0b1f1b]/70 p-5 backdrop-blur-xl">
                        <FiDollarSign className="mb-4 text-xl text-cyan-300" />
                        <p className="text-xs uppercase tracking-wider text-slate-500">Net Movement</p>
                        <p className={`mt-2 text-2xl font-bold ${totals.revenue - totals.expense >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                            {money(totals.revenue - totals.expense)}
                        </p>
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-400/10 bg-[#0b1f1b]/65 shadow-2xl shadow-black/20 backdrop-blur-xl p-5">
                    <div className="overflow-x-auto">
                        <table className="min-w-[700px] w-full text-sm">
                            <thead className="bg-white/[0.03]">
                                <tr className="border-b border-white/5 text-left">
                                    <th className="px-5 py-4 font-semibold text-emerald-300">Month</th>
                                    <th className="px-5 py-4 font-semibold text-emerald-300">Revenue</th>
                                    <th className="px-5 py-4 font-semibold text-violet-300">Expense</th>
                                    <th className="px-5 py-4 font-semibold text-cyan-300">Hand on Cash</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allSummary.map((summary, index) => (
                                    <tr key={summary._id || `${summary.month_name}-${index}`} className="border-b border-white/5 transition hover:bg-white/[0.025]">
                                        <td className="px-5 py-4 font-medium text-white">{summary.month_name}</td>
                                        <td className="px-5 py-4 text-emerald-300">{money(summary.total_revenue_amount)}</td>
                                        <td className="px-5 py-4 text-violet-300">{money(summary.total_expense_amount)}</td>
                                        <td className="px-5 py-4 text-cyan-300">{money(summary.hand_on_cash)}</td>
                                    </tr>
                                ))}
                                {allSummary.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-5 py-12 text-center text-slate-500">No monthly summary data found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-4 text-center text-xs text-slate-600">
                    Generated for BISMILLAH ENTERPRISE
                </div>
            </div>

            <div ref={summaryPrintRef} className="hidden">
                <div className="brand">
                    <h1>BISMILLAH ENTERPRISE</h1>
                    <p>Shop Financial Summary</p>
                </div>
                <div className="title">Shop Transactions Summary of Last {allSummary.length} Months</div>
                <table>
                    <thead>
                        <tr>
                            <th>Month Name</th>
                            <th>Total Revenue Amount</th>
                            <th>Total Expense Amount</th>
                            <th>Hand on Cash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allSummary.map((summary, index) => (
                            <tr key={summary._id || `${summary.month_name}-${index}`}>
                                <td>{summary.month_name}</td>
                                <td>{summary.total_revenue_amount}</td>
                                <td>{summary.total_expense_amount}</td>
                                <td>{summary.hand_on_cash}</td>
                            </tr>
                        ))}
                        <tr className="total">
                            <td>Total</td>
                            <td>{totals.revenue}</td>
                            <td>{totals.expense}</td>
                            <td>-</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShopTransectionsSummary;
