import React, {
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';

import {
    MdCalendarMonth,
    MdPrint,
    MdDeleteOutline,
    MdOutlineCancel,
    MdLock
} from 'react-icons/md';

import Swal from 'sweetalert2';

import Loading from '../../Shared/Loading/Loading';

import {
    useNavigate
} from 'react-router-dom';


const API = 'http://localhost:5000';


/* =========================================================
   NUMBER HELPERS
========================================================= */

const n = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
};


const money = (value) =>
    n(value).toLocaleString(
        'en-BD',
        {
            maximumFractionDigits: 2
        }
    );


/* =========================================================
   DATE HELPER
========================================================= */

const dateOnly = (value) => {
    if (!value) return '';

    const text = String(value).trim();

    const match = text.match(
        /^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/
    );

    return match
        ? `${match[1]} ${match[2]}, ${match[3]}`
        : text.split(',')[0].trim();
};


/* =========================================================
   NORMALIZE LIST DATA
========================================================= */

const asList = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (
        value &&
        Array.isArray(value.amounts)
    ) {
        return value.amounts.map(
            (amount, index) => ({
                amount,

                comment:
                    value.descriptions?.[index] ||
                    '—'
            })
        );
    }

    return [];
};


/* =========================================================
   LIST TOTAL
========================================================= */

const listTotal = (value) =>
    asList(value).reduce(
        (sum, item) =>
            sum + n(item?.amount),
        0
    );


/* =========================================================
   DISCOUNT TOTAL
========================================================= */

const discountTotal = (value) =>
    Array.isArray(value)
        ? value.reduce(
            (sum, item) =>
                sum + n(item?.amount),
            0
        )
        : 0;


/* =========================================================
   LOAN OUTSTANDING TOTAL
========================================================= */

const loanDueTotal = (value) =>
    Array.isArray(value)
        ? value.reduce(
            (total, loan) => {
                const loanAmount =
                    n(loan?.amount);

                const paidAmount =
                    Array.isArray(
                        loan?.payback_transactions
                    )
                        ? loan.payback_transactions.reduce(
                            (
                                sum,
                                payment
                            ) =>
                                sum +
                                n(
                                    payment?.amount
                                ),
                            0
                        )
                        : 0;

                return (
                    total +
                    Math.max(
                        0,
                        loanAmount -
                        paidAmount
                    )
                );
            },
            0
        )
        : 0;


/* =========================================================
   LOAN CREATED ON SPECIFIC DATE
========================================================= */

const loanTotalOnDate = (
    loanList,
    date
) => {
    if (!Array.isArray(loanList)) {
        return 0;
    }

    return loanList.reduce(
        (total, loan) => {
            if (
                dateOnly(loan?.date) !==
                dateOnly(date)
            ) {
                return total;
            }

            return (
                total +
                n(loan?.amount)
            );
        },
        0
    );
};


/* =========================================================
   ROW CALCULATIONS
========================================================= */

const rowNumbers = (
    row,
    loanData = {}
) => {
    const computer =
        n(row?.computer_revenues);

    const stationary =
        n(row?.stationary_revenues);

    const photocopy =
        n(row?.photocopy_revenues);

    /*
     * Air Ticket Revenue
     *
     * This is the business revenue/profit
     * from Air Ticket.
     */
    const airTicket =
        n(row?.air_ticket_revenues);

    /*
     * IMPORTANT:
     *
     * Total Ticket Sell is NOT the same as
     * Air Ticket Revenue.
     *
     * Total Ticket Sell =
     * air_ticket_sell
     *
     * Example:
     *
     * Ticket Price = 10,000
     * Agent Price  = 7,500
     * Discount     = 200
     *
     * Total Ticket Sell = 10,000
     * Air Ticket Revenue = 2,300
     */
    const airTicketSell =
        n(row?.air_ticket_sell);

    const others =
        listTotal(
            row?.others_revenues
        );

    const discount =
        discountTotal(
            row?.discount
        );

    const expenses =
        listTotal(
            row?.expenses
        );

    const due =
        n(row?.due);


    /*
     * Revenue does NOT include
     * Total Ticket Sell separately.
     *
     * Air Ticket Revenue is already included
     * in revenue.
     */
    const revenue =
        computer +
        stationary +
        photocopy +
        airTicket +
        others;


    const givenLoan =
        loanTotalOnDate(
            loanData?.givenLoanList,
            row?.date
        );


    const takenLoan =
        loanTotalOnDate(
            loanData?.takenLoanList,
            row?.date
        );


    /*
     * =====================================================
     * HAND CASH FORMULA
     * =====================================================
     *
     * Hand Cash =
     *
     * Revenue
     * + Taken Loan
     * - Given Loan
     * - Expenses
     *
     * IMPORTANT:
     *
     * Discount is NOT subtracted.
     * Due is NOT subtracted.
     * Total Ticket Sell is NOT added again,
     * because Air Ticket Revenue is already
     * included inside Revenue.
     */
    const cash =
        revenue +
        airTicketSell +
        takenLoan -
        airTicket -
        due -
        givenLoan -
        expenses;


    return {
        computer,

        stationary,

        photocopy,

        airTicket,

        /*
         * Total Air Ticket Sell
         */
        airTicketSell,

        others,

        discount,

        expenses,

        due,

        revenue,

        givenLoan,

        takenLoan,

        cash
    };
};


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ViewDailyTransactions() {
    const [data, setData] =
        useState(null);

    const [rows, setRows] =
        useState([]);

    const [start, setStart] =
        useState('');

    const [end, setEnd] =
        useState('');

    const [details, setDetails] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [closing, setClosing] =
        useState(false);

    const printRef =
        useRef();

    const navigate =
        useNavigate();


    /* =====================================================
       LOAD DATA
    ===================================================== */

    const load = async () => {
        try {
            setLoading(true);

            const response =
                await fetch(
                    `${API}/daily_transactions`
                );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.error ||
                    'Load failed'
                );
            }

            setData(result);

            setRows(
                Array.isArray(
                    result?.summary
                )
                    ? result.summary
                    : []
            );
        } catch (error) {
            Swal.fire(
                'Load Failed',
                error.message,
                'error'
            );
        } finally {
            setLoading(false);
        }
    };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        load();
    }, []);


    /* =====================================================
       DATE FILTER
    ===================================================== */

    const apply = (
        s,
        e
    ) => {
        const source =
            Array.isArray(
                data?.summary
            )
                ? data.summary
                : [];


        if (!s && !e) {
            return setRows(source);
        }


        const sd = s
            ? new Date(
                `${s}T00:00:00`
            )
            : null;


        const ed = e
            ? new Date(
                `${e}T23:59:59`
            )
            : null;


        setRows(
            source.filter(
                (row) => {
                    const parsed =
                        new Date(
                            dateOnly(
                                row?.date
                            )
                        );


                    return (
                        (!sd ||
                            parsed >= sd) &&
                        (!ed ||
                            parsed <= ed)
                    );
                }
            )
        );
    };


    /* =====================================================
       CURRENT DAY ROW
    ===================================================== */

    const currentRow =
        useMemo(
            () => ({
                date:
                    data?.date || '',

                computer_revenues:
                    data?.computer_revenues,

                stationary_revenues:
                    data?.stationary_revenues,

                photocopy_revenues:
                    data?.photocopy_revenues,

                air_ticket_revenues:
                    data?.air_ticket_revenues,

                /*
                 * IMPORTANT:
                 * Current day's Total Ticket Sell.
                 */
                air_ticket_sell:
                    data?.air_ticket_sell,

                others_revenues:
                    data?.others_revenues,

                taken_loan_list:
                    data?.taken_loan_list,

                given_loan_list:
                    data?.given_loan_list,

                discount:
                    data?.discount,

                due:
                    Array.isArray(
                        data?.due_list
                    )
                        ? data.due_list
                            .filter(
                                (
                                    group
                                ) =>
                                    dateOnly(
                                        group?.date
                                    ) ===
                                    dateOnly(
                                        data?.date
                                    )
                            )
                            .flatMap(
                                (
                                    group
                                ) =>
                                    Array.isArray(
                                        group?.due_data
                                    )
                                        ? group.due_data
                                        : []
                            )
                            .reduce(
                                (
                                    sum,
                                    item
                                ) =>
                                    sum +
                                    n(
                                        item?.amount
                                    ),
                                0
                            )
                        : 0,

                expenses:
                    data?.expenses
            }),
            [data]
        );


    /* =====================================================
       LAST CLOSING
    ===================================================== */

    const lastClosing =
        useMemo(() => {
            const list =
                Array.isArray(
                    data?.closing_summary
                )
                    ? data.closing_summary
                    : [];

            return list.length
                ? list[list.length - 1]
                : null;
        }, [data]);


    /* =====================================================
       SUMMARY ROWS
    ===================================================== */

    const summaryRows =
        useMemo(
            () => rows,
            [rows]
        );


    /* =====================================================
       TOTALS
    ===================================================== */

    const totals =
        useMemo(() => {
            const loanData = {
                givenLoanList:
                    data?.given_loan_list,

                takenLoanList:
                    data?.taken_loan_list
            };


            const result =
                summaryRows.reduce(
                    (
                        acc,
                        row
                    ) => {
                        const x =
                            rowNumbers(
                                row,
                                loanData
                            );


                        acc.computer +=
                            x.computer;

                        acc.stationary +=
                            x.stationary;

                        acc.photocopy +=
                            x.photocopy;

                        acc.airTicket +=
                            x.airTicket;

                        /*
                         * IMPORTANT:
                         *
                         * Total Ticket Sell
                         * is summed separately.
                         */
                        acc.airTicketSell +=
                            x.airTicketSell;

                        acc.others +=
                            x.others;

                        acc.discount +=
                            x.discount;

                        acc.expenses +=
                            x.expenses;

                        acc.due +=
                            x.due;

                        acc.revenue +=
                            x.revenue;


                        return acc;
                    },
                    {
                        computer: 0,

                        stationary: 0,

                        photocopy: 0,

                        airTicket: 0,

                        /*
                         * IMPORTANT:
                         * Initialize Total Ticket Sell.
                         */
                        airTicketSell: 0,

                        others: 0,

                        discount: 0,

                        expenses: 0,

                        due: 0,

                        revenue: 0
                    }
                );


            /*
             * =================================================
             * GIVEN LOAN TOTAL
             * =================================================
             *
             * Loan amount is shown only on the
             * exact date when the loan was created.
             *
             * It is NOT repeated on later dates.
             */
            result.givenLoan =
                summaryRows.reduce(
                    (
                        total,
                        row
                    ) =>
                        total +
                        loanTotalOnDate(
                            data?.given_loan_list,
                            row?.date
                        ),
                    0
                );


            /*
             * =================================================
             * TAKEN LOAN TOTAL
             * =================================================
             */
            result.takenLoan =
                summaryRows.reduce(
                    (
                        total,
                        row
                    ) =>
                        total +
                        loanTotalOnDate(
                            data?.taken_loan_list,
                            row?.date
                        ),
                    0
                );


            /*
             * =================================================
             * CURRENT DAY LOAN
             * =================================================
             *
             * If today's row is not already inside summary,
             * include today's loan.
             */
            const currentDate =
                dateOnly(
                    data?.date
                );


            if (
                currentDate &&
                !summaryRows.some(
                    (row) =>
                        dateOnly(
                            row?.date
                        ) === currentDate
                )
            ) {
                result.givenLoan +=
                    loanTotalOnDate(
                        data?.given_loan_list,
                        currentDate
                    );


                result.takenLoan +=
                    loanTotalOnDate(
                        data?.taken_loan_list,
                        currentDate
                    );
            }


            /*
             * =================================================
             * HAND CASH
             * =================================================
             *
             * Revenue
             * + Taken Loan
             * - Given Loan
             * - Expenses
             *
             * NO DUE subtraction.
             */
            result.cash =
                result.revenue +
                result.airTicketSell +
                result.takenLoan -
                result.airTicket -
                result.due -
                result.givenLoan -
                result.expenses;
            /*
             * =================================================
             * OUTSTANDING LOAN BALANCE
             * =================================================
             *
             * These are separate from cash movement.
             */
            result.givenLoanDue =
                loanDueTotal(
                    data?.given_loan_list
                );


            result.takenLoanDue =
                loanDueTotal(
                    data?.taken_loan_list
                );


            return result;
        }, [
            summaryRows,

            data?.date,

            data?.given_loan_list,

            data?.taken_loan_list
        ]);


    /* =====================================================
       PRINT
    ===================================================== */

    const print = () => {
        const iframe =
            document.createElement(
                'iframe'
            );


        iframe.style.cssText =
            'position:fixed;width:0;height:0;border:0';


        document.body.appendChild(
            iframe
        );


        const doc =
            iframe.contentWindow.document;


        doc.open();


        doc.write(`
            <html>
                <head>
                    <title>
                        Accounts Record
                    </title>

                    <style>
                        @page {
                            size: A4 landscape;
                            margin: 10mm;
                        }

                        body {
                            font-family: Arial;
                            color: #000;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }

                        th,
                        td {
                            border: 1px solid #000;
                            padding: 6px;
                            text-align: center;
                            font-size: 9px;
                        }

                        h1,
                        p {
                            text-align: center;
                        }
                    </style>
                </head>

                <body>
                    ${printRef.current.innerHTML}
                </body>
            </html>
        `);


        doc.close();


        iframe.onload = () => {
            iframe.contentWindow.print();

            setTimeout(
                () =>
                    iframe.remove(),
                500
            );
        };
    };


    /* =====================================================
       DELETE SUMMARY
    ===================================================== */

    const del = async () => {
        if (!start || !end) {
            return Swal.fire(
                'Select Date Range',
                'Choose both dates.',
                'warning'
            );
        }


        const first =
            await Swal.fire({
                title:
                    'Delete selected summary?',

                text:
                    `${start} to ${end}`,

                icon: 'warning',

                showCancelButton:
                    true,

                confirmButtonColor:
                    '#ef4444'
            });


        if (!first.isConfirmed) {
            return;
        }


        const second =
            await Swal.fire({
                title:
                    'Final Confirmation',

                text:
                    'This will permanently remove the selected summary rows.',

                icon: 'error',

                showCancelButton:
                    true,

                confirmButtonText:
                    'Yes, Delete',

                confirmButtonColor:
                    '#dc2626'
            });


        if (!second.isConfirmed) {
            return;
        }


        try {
            const response =
                await fetch(
                    `${API}/daily_transactions/delete_summary`,
                    {
                        method:
                            'PATCH',

                        headers: {
                            'content-type':
                                'application/json'
                        },

                        body:
                            JSON.stringify({
                                startDate:
                                    start,

                                endDate:
                                    end
                            })
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {
                throw new Error(
                    result?.error ||
                    'Delete failed'
                );
            }


            await load();


            setStart('');

            setEnd('');
        } catch (error) {
            Swal.fire(
                'Delete Failed',
                error.message,
                'error'
            );
        }
    };


    /* =====================================================
       CLOSE ACCOUNT
    ===================================================== */

    const closeAccount =
        async () => {
            const first =
                await Swal.fire({
                    title:
                        'Close Account?',

                    text:
                        'All current-day calculations will be stored in Closing Summary and the active summary will be reset.',

                    icon: 'warning',

                    showCancelButton:
                        true,

                    confirmButtonText:
                        'Continue',

                    confirmButtonColor:
                        '#10b981'
                });


            if (!first.isConfirmed) {
                return;
            }


            const second =
                await Swal.fire({
                    title:
                        'Final Confirmation',

                    text:
                        'Are you absolutely sure you want to close today\'s account?',

                    icon: 'question',

                    showCancelButton:
                        true,

                    confirmButtonText:
                        'Yes, Close Account',

                    confirmButtonColor:
                        '#059669'
                });


            if (!second.isConfirmed) {
                return;
            }


            try {
                setClosing(true);


                const response =
                    await fetch(
                        `${API}/daily_transactions/close_account`,
                        {
                            method:
                                'PATCH'
                        }
                    );


                const result =
                    await response.json();


                if (
                    !response.ok ||
                    !result?.success
                ) {
                    throw new Error(
                        result?.error ||
                        'Account closing failed'
                    );
                }


                await load();


                Swal.fire({
                    icon: 'success',

                    title:
                        'Account Closed',

                    showConfirmButton:
                        false,

                    timer: 1200
                });
            } catch (error) {
                Swal.fire(
                    'Closing Failed',
                    error.message,
                    'error'
                );
            } finally {
                setClosing(false);
            }
        };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <Loading />
            </div>
        );
    }


    /* =====================================================
       DISPLAY ROWS
    ===================================================== */

    const displayRows = [
        currentRow,

        ...(lastClosing
            ? [
                {
                    ...lastClosing,

                    __closing: true
                }
            ]
            : []),

        ...summaryRows
    ];


    /* =====================================================
       CURRENT ROW NUMBERS
    ===================================================== */

    const currentNumbers =
        rowNumbers(
            currentRow,
            {
                givenLoanList:
                    data?.given_loan_list,

                takenLoanList:
                    data?.taken_loan_list
            }
        );


    return (
        <div className="min-h-full px-4 py-6 text-slate-200 overflow-scroll">

            <div className="max-w-[1500px] mx-auto">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">

                    <div>

                        <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
                            Analytics
                        </p>


                        <h1 className="text-3xl md:text-4xl font-black text-white">
                            View Daily Transactions
                        </h1>


                        <p className="text-slate-500 mt-2">
                            Current day → last closing → historical summary.
                        </p>

                    </div>


                    <button
                        onClick={closeAccount}
                        disabled={closing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-black text-[#071311] disabled:opacity-50"
                    >

                        <MdLock />

                        {
                            closing
                                ? 'Closing...'
                                : 'Closing Account'
                        }

                    </button>

                </div>


                {/* =================================================
                    SUMMARY CARDS
                ================================================= */}

                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 my-6">

                    {[
                        [
                            'Revenue',
                            totals.revenue,
                            'text-emerald-300'
                        ],

                        [
                            'Discount',
                            totals.discount,
                            'text-pink-300'
                        ],

                        [
                            'Air Ticket Revenue',
                            totals.airTicket,
                            'text-violet-300'
                        ],

                        [
                            'Total Ticket Sell',
                            totals.airTicketSell,
                            'text-purple-300'
                        ],

                        [
                            'Expenses',
                            totals.expenses,
                            'text-red-300'
                        ],

                        [
                            'Due',
                            totals.due,
                            'text-amber-300'
                        ],

                        [
                            'Given Loan Due',
                            totals.givenLoanDue,
                            'text-orange-300'
                        ],

                        [
                            'Taken Loan Due',
                            totals.takenLoanDue,
                            'text-blue-300'
                        ],

                        [
                            'Cash',
                            totals.cash,
                            totals.cash < 0
                                ? 'text-red-300'
                                : 'text-cyan-300'
                        ]
                    ].map(
                        ([
                            label,
                            value,
                            color
                        ]) => (
                            <div
                                key={label}
                                className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                            >

                                <p className="text-xs text-slate-500 uppercase">
                                    {label}
                                </p>


                                <p
                                    className={`text-xl font-black mt-1 ${color}`}
                                >
                                    ৳ {money(value)}
                                </p>

                            </div>
                        )
                    )}

                </div>


                {/* =================================================
                    DATE FILTER
                ================================================= */}

                <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 mb-6">

                    <div className="flex items-center gap-2 mb-4">

                        <MdCalendarMonth className="text-emerald-400" />

                        <b>
                            Date Filter
                        </b>

                    </div>


                    <div className="grid md:grid-cols-3 gap-4">

                        <input
                            type="date"
                            value={start}
                            onChange={(e) => {
                                setStart(
                                    e.target.value
                                );

                                apply(
                                    e.target.value,

                                    end &&
                                        e.target.value <=
                                        end
                                        ? end
                                        : ''
                                );
                            }}
                            className="relative h-11 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-white"
                        />


                        <input
                            type="date"
                            min={
                                start ||
                                undefined
                            }
                            value={end}
                            onChange={(e) => {
                                if (
                                    start &&
                                    e.target.value <
                                    start
                                ) {
                                    return Swal.fire(
                                        'Invalid Range',
                                        'End date cannot be earlier.',
                                        'warning'
                                    );
                                }


                                setEnd(
                                    e.target.value
                                );


                                apply(
                                    start,
                                    e.target.value
                                );
                            }}
                            className="relative h-11 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-white"
                        />


                        <button
                            onClick={() => {
                                setStart('');

                                setEnd('');

                                setRows(
                                    Array.isArray(
                                        data?.summary
                                    )
                                        ? data.summary
                                        : []
                                );
                            }}
                            className="h-11 rounded-xl border border-white/10"
                        >
                            Clear
                        </button>

                    </div>

                </div>


                {/* =================================================
                    MAIN TABLE
                ================================================= */}

                <div className="rounded-3xl border border-white/10 bg-white/[0.025] overflow-x-auto p-5">

                    <table className="w-full min-w-[1450px] text-sm">

                        <thead>

                            <tr>

                                {[
                                    'Date / Type',

                                    'Computer',

                                    'Stationary',

                                    'Photocopy',

                                    'Air Ticket',

                                    /*
                                     * IMPORTANT:
                                     * Total Ticket Sell column
                                     */
                                    'Total Ticket Sell',

                                    'Others',

                                    'Discount',

                                    'Revenue',

                                    'Due',

                                    'Expenses',

                                    'Given Loan',

                                    'Taken Loan',

                                    'Hand Cash'
                                ].map(
                                    (x) => (
                                        <th
                                            key={x}
                                            className="text-left px-4 py-4 text-slate-500"
                                        >
                                            {x}
                                        </th>
                                    )
                                )}

                            </tr>

                        </thead>


                        <tbody>

                            {displayRows.map(
                                (
                                    row,
                                    index
                                ) => {

                                    const x =
                                        row.__closing
                                            ? {

                                                computer:
                                                    n(
                                                        row.computer_revenues
                                                    ),

                                                stationary:
                                                    n(
                                                        row.stationary_revenues
                                                    ),

                                                photocopy:
                                                    n(
                                                        row.photocopy_revenues
                                                    ),

                                                airTicket:
                                                    n(
                                                        row.air_ticket_revenues
                                                    ),

                                                /*
                                                 * IMPORTANT:
                                                 * Closing summary's
                                                 * Total Ticket Sell.
                                                 */
                                                airTicketSell:
                                                    n(
                                                        row.air_ticket_sell
                                                    ),

                                                others:
                                                    listTotal(
                                                        row.others_revenues
                                                    ),

                                                discount:
                                                    discountTotal(
                                                        row.discount
                                                    ),

                                                expenses:
                                                    listTotal(
                                                        row.expenses
                                                    ),

                                                due:
                                                    n(
                                                        row.due
                                                    ),

                                                revenue:
                                                    n(
                                                        row.computer_revenues
                                                    ) +
                                                    n(
                                                        row.stationary_revenues
                                                    ) +
                                                    n(
                                                        row.photocopy_revenues
                                                    ) +
                                                    n(
                                                        row.air_ticket_revenues
                                                    ) +
                                                    listTotal(
                                                        row.others_revenues
                                                    ),

                                                givenLoan:
                                                    0,

                                                takenLoan:
                                                    0,

                                                cash:
                                                    n(
                                                        row.available_balance
                                                    )
                                            }
                                            : rowNumbers(
                                                row,
                                                {
                                                    givenLoanList:
                                                        data?.given_loan_list,

                                                    takenLoanList:
                                                        data?.taken_loan_list
                                                }
                                            );


                                    const label =
                                        row.__closing
                                            ? `Last Closing · ${row.closing_date}`
                                            : index === 0
                                                ? `Current · ${row.date}`
                                                : row.date;


                                    return (
                                        <tr
                                            key={`${label}-${index}`}
                                            className={`border-t border-white/5 ${row.__closing
                                                ? 'bg-emerald-500/[0.04]'
                                                : ''
                                                }`}
                                        >

                                            {/* DATE */}

                                            <td className="px-4 py-4 text-white font-semibold">
                                                {label}
                                            </td>


                                            {/* COMPUTER */}

                                            <td className="px-4">
                                                {money(
                                                    x.computer
                                                )}
                                            </td>


                                            {/* STATIONARY */}

                                            <td className="px-4">
                                                {money(
                                                    x.stationary
                                                )}
                                            </td>


                                            {/* PHOTOCOPY */}

                                            <td className="px-4">
                                                {money(
                                                    x.photocopy
                                                )}
                                            </td>


                                            {/* AIR TICKET REVENUE */}

                                            <td className="px-4 text-violet-300">
                                                {money(
                                                    x.airTicket
                                                )}
                                            </td>


                                            {/* =================================================
                                                TOTAL TICKET SELL
                                            ================================================= */}

                                            <td className="px-4 text-purple-300 font-bold">
                                                {money(
                                                    x.airTicketSell
                                                )}
                                            </td>


                                            {/* OTHERS */}

                                            <td
                                                onClick={() =>
                                                    !row.__closing &&
                                                    setDetails({
                                                        title:
                                                            'Other Revenue',

                                                        list:
                                                            asList(
                                                                row.others_revenues
                                                            )
                                                    })
                                                }
                                                className="px-4 text-emerald-300 cursor-pointer"
                                            >
                                                {money(
                                                    x.others
                                                )}
                                            </td>


                                            {/* DISCOUNT */}

                                            <td
                                                onClick={() =>
                                                    !row.__closing &&
                                                    setDetails({
                                                        title:
                                                            'Discount',

                                                        list:
                                                            asList(
                                                                row.discount
                                                            )
                                                    })
                                                }
                                                className="px-4 text-pink-300 cursor-pointer"
                                            >
                                                {money(
                                                    x.discount
                                                )}
                                            </td>


                                            {/* REVENUE */}

                                            <td className="px-4 text-emerald-200 font-bold">
                                                {money(
                                                    x.revenue
                                                )}
                                            </td>


                                            {/* DUE */}

                                            <td className="px-4 text-amber-300 font-bold">
                                                {money(
                                                    x.due
                                                )}
                                            </td>


                                            {/* EXPENSE */}

                                            <td
                                                onClick={() =>
                                                    !row.__closing &&
                                                    setDetails({
                                                        title:
                                                            'Expenses',

                                                        list:
                                                            asList(
                                                                row.expenses
                                                            )
                                                    })
                                                }
                                                className="px-4 text-red-300 cursor-pointer"
                                            >
                                                {money(
                                                    x.expenses
                                                )}
                                            </td>


                                            {/* GIVEN LOAN */}

                                            <td className="px-4 text-orange-300">
                                                {money(
                                                    x.givenLoan
                                                )}
                                            </td>


                                            {/* TAKEN LOAN */}

                                            <td className="px-4 text-blue-300">
                                                {money(
                                                    x.takenLoan
                                                )}
                                            </td>


                                            {/* HAND CASH */}

                                            <td
                                                className={`px-4 font-black ${x.cash < 0
                                                    ? 'text-red-300'
                                                    : 'text-cyan-300'
                                                    }`}
                                            >
                                                {money(
                                                    x.cash
                                                )}
                                            </td>

                                        </tr>
                                    );
                                }
                            )}

                        </tbody>


                        {/* =================================================
                            FOOTER TOTAL
                        ================================================= */}

                        <tfoot>

                            <tr className="font-black border-t border-white/10">

                                <td className="px-4 py-4">
                                    Filtered Summary Total
                                </td>


                                <td>
                                    {money(
                                        totals.computer
                                    )}
                                </td>


                                <td>
                                    {money(
                                        totals.stationary
                                    )}
                                </td>


                                <td>
                                    {money(
                                        totals.photocopy
                                    )}
                                </td>


                                <td>
                                    {money(
                                        totals.airTicket
                                    )}
                                </td>


                                {/* =================================================
                                    TOTAL TICKET SELL TOTAL
                                ================================================= */}

                                <td className="text-purple-300">
                                    {money(
                                        totals.airTicketSell
                                    )}
                                </td>


                                <td>
                                    {money(
                                        totals.others
                                    )}
                                </td>


                                <td>
                                    {money(
                                        totals.discount
                                    )}
                                </td>


                                <td>
                                    {money(
                                        totals.revenue
                                    )}
                                </td>


                                <td>
                                    {money(
                                        totals.due
                                    )}
                                </td>


                                <td>
                                    {money(
                                        totals.expenses
                                    )}
                                </td>


                                <td>
                                    {money(
                                        totals.givenLoan
                                    )}
                                </td>


                                <td>
                                    {money(
                                        totals.takenLoan
                                    )}
                                </td>


                                <td>
                                    {money(
                                        totals.cash
                                    )}
                                </td>

                            </tr>

                        </tfoot>

                    </table>

                </div>


                {/* =================================================
                    ACTION BUTTONS
                ================================================= */}

                <div className="flex flex-wrap justify-center gap-3 mt-6">

                    <button
                        onClick={del}
                        className="px-5 py-2.5 rounded-xl bg-red-500/10 text-red-300 font-bold"
                    >
                        <MdDeleteOutline className="inline" />

                        {' '}

                        Delete Summary Data
                    </button>


                    <button
                        onClick={print}
                        className="px-5 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-300 font-bold"
                    >
                        <MdPrint className="inline" />

                        {' '}

                        Print
                    </button>

                </div>


                {/* =================================================
                    PRINT VERSION
                ================================================= */}

                <div
                    ref={printRef}
                    className="hidden"
                >

                    <h1>
                        Accounts Record
                    </h1>


                    <p>
                        {
                            start ||
                            currentRow.date
                        }

                        {' - '}

                        {
                            end ||
                            summaryRows[
                                summaryRows.length - 1
                            ]?.date ||
                            currentRow.date
                        }
                    </p>


                    <table>

                        <thead>

                            <tr>

                                {[
                                    'Date / Type',

                                    'Computer',

                                    'Stationary',

                                    'Photocopy',

                                    'Air Ticket',

                                    /*
                                     * Total Ticket Sell
                                     */
                                    'Total Ticket Sell',

                                    'Others',

                                    'Discount',

                                    'Revenue',

                                    'Due',

                                    'Expenses',

                                    'Given Loan',

                                    'Taken Loan',

                                    'Cash'
                                ].map(
                                    (x) => (
                                        <th
                                            key={x}
                                        >
                                            {x}
                                        </th>
                                    )
                                )}

                            </tr>

                        </thead>


                        <tbody>

                            {displayRows.map(
                                (
                                    row,
                                    index
                                ) => {

                                    const x =
                                        row.__closing
                                            ? {

                                                computer:
                                                    n(
                                                        row.computer_revenues
                                                    ),

                                                stationary:
                                                    n(
                                                        row.stationary_revenues
                                                    ),

                                                photocopy:
                                                    n(
                                                        row.photocopy_revenues
                                                    ),

                                                airTicket:
                                                    n(
                                                        row.air_ticket_revenues
                                                    ),

                                                /*
                                                 * Total Ticket Sell
                                                 */
                                                airTicketSell:
                                                    n(
                                                        row.air_ticket_sell
                                                    ),

                                                others:
                                                    listTotal(
                                                        row.others_revenues
                                                    ),

                                                discount:
                                                    discountTotal(
                                                        row.discount
                                                    ),

                                                revenue:
                                                    n(
                                                        row.computer_revenues
                                                    ) +
                                                    n(
                                                        row.stationary_revenues
                                                    ) +
                                                    n(
                                                        row.photocopy_revenues
                                                    ) +
                                                    n(
                                                        row.air_ticket_revenues
                                                    ) +
                                                    listTotal(
                                                        row.others_revenues
                                                    ),

                                                due:
                                                    n(
                                                        row.due
                                                    ),

                                                expenses:
                                                    listTotal(
                                                        row.expenses
                                                    ),

                                                givenLoan:
                                                    0,

                                                takenLoan:
                                                    0,

                                                cash:
                                                    n(
                                                        row.available_balance
                                                    )
                                            }
                                            : rowNumbers(
                                                row,
                                                {
                                                    givenLoanList:
                                                        data?.given_loan_list,

                                                    takenLoanList:
                                                        data?.taken_loan_list
                                                }
                                            );


                                    return (
                                        <tr
                                            key={index}
                                        >

                                            <td>
                                                {
                                                    row.__closing
                                                        ? `Last Closing · ${row.closing_date}`
                                                        : row.date
                                                }
                                            </td>


                                            <td>
                                                {
                                                    money(
                                                        x.computer
                                                    )
                                                }
                                            </td>


                                            <td>
                                                {
                                                    money(
                                                        x.stationary
                                                    )
                                                }
                                            </td>


                                            <td>
                                                {
                                                    money(
                                                        x.photocopy
                                                    )
                                                }
                                            </td>


                                            <td>
                                                {
                                                    money(
                                                        x.airTicket
                                                    )
                                                }
                                            </td>


                                            {/* =================================================
                                                PRINT TOTAL TICKET SELL
                                            ================================================= */}

                                            <td>
                                                {
                                                    money(
                                                        x.airTicketSell
                                                    )
                                                }
                                            </td>


                                            <td>
                                                {
                                                    money(
                                                        x.others
                                                    )
                                                }
                                            </td>


                                            <td>
                                                {
                                                    money(
                                                        x.discount
                                                    )
                                                }
                                            </td>


                                            <td>
                                                {
                                                    money(
                                                        x.revenue
                                                    )
                                                }
                                            </td>


                                            <td>
                                                {
                                                    money(
                                                        x.due
                                                    )
                                                }
                                            </td>


                                            <td>
                                                {
                                                    money(
                                                        x.expenses
                                                    )
                                                }
                                            </td>


                                            <td>
                                                {
                                                    money(
                                                        x.givenLoan
                                                    )
                                                }
                                            </td>


                                            <td>
                                                {
                                                    money(
                                                        x.takenLoan
                                                    )
                                                }
                                            </td>


                                            <td>
                                                {
                                                    money(
                                                        x.cash
                                                    )
                                                }
                                            </td>

                                        </tr>
                                    );
                                }
                            )}

                        </tbody>

                    </table>

                </div>


                {/* =================================================
                    DETAILS MODAL
                ================================================= */}

                {details && (
                    <div
                        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                        onClick={() =>
                            setDetails(null)
                        }
                    >

                        <div
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                            className="bg-[#0b1b18] rounded-3xl p-6 w-full max-w-xl"
                        >

                            <div className="flex justify-between">

                                <h2 className="font-bold text-white">
                                    {
                                        details.title
                                    }
                                </h2>


                                <button
                                    onClick={() =>
                                        setDetails(
                                            null
                                        )
                                    }
                                >
                                    <MdOutlineCancel />
                                </button>

                            </div>


                            {
                                asList(
                                    details.list
                                ).map(
                                    (
                                        x,
                                        i
                                    ) => (
                                        <div
                                            key={i}
                                            className="flex justify-between gap-4 py-3 border-b border-white/5"
                                        >

                                            <span>
                                                {
                                                    x.comment ||
                                                    x.reference ||
                                                    '—'
                                                }
                                            </span>


                                            <b>
                                                ৳{' '}
                                                {
                                                    money(
                                                        x.amount
                                                    )
                                                }
                                            </b>

                                        </div>
                                    )
                                )
                            }

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}