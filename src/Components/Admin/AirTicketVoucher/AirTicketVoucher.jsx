import React, { useRef, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import {
    Link,
    useLoaderData,
    useLocation,
    useNavigate,
    useParams
} from 'react-router-dom';
import Swal from 'sweetalert2';
import VoucherHeading from '../../Shared/VoucherHeading/VoucherHeading';
import AirTicketVoucherHeading from '../../Shared/AirTicketVoucherHeading/AirTicketVoucherHeading';

const AirTicketVoucher = () => {
    const { voucher_no } = useParams();
    const client = useLoaderData();

    const [isEdit, setIsEdit] = useState(false);

    const matchedVoucher = client?.vouchers?.find(
        (voucher) =>
            parseInt(voucher.voucher_no) === parseInt(voucher_no)
    );

    const [discount, setDiscount] = useState(
        Number(matchedVoucher?.discount) || 0
    );

    const [due, setDue] = useState(
        Number(matchedVoucher?.due_amount) || 0
    );

    const [paid, setPaid] = useState(
        Number(matchedVoucher?.paid_amount) || 0
    );

    const location = useLocation();
    const from = location?.state?.pathname;
    const navigate = useNavigate();

    const [modal, setModal] = useState(false);
    const [statusError, setStatusError] = useState(false);

    const now = new Date();

    const Time = now.toLocaleTimeString('en-BD', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    const currentDate = now.toLocaleDateString('en-BD', {
        day: 'numeric',
        year: 'numeric',
        month: 'long',
    });

    const transection_amount_ref = useRef();
    const payment_status_ref = useRef();
    const more_discount_ref = useRef();
    const voucherPrintRef = useRef();

    /*
    |--------------------------------------------------------------------------
    | Payment Calculation Helpers
    |--------------------------------------------------------------------------
    */

    const getNumber = (value) => {
        const number = parseFloat(value);

        return Number.isFinite(number) ? number : 0;
    };

    const calculatePayment = () => {
        const oldDue = getNumber(matchedVoucher?.due_amount);
        const oldPaid = getNumber(matchedVoucher?.paid_amount);
        const oldDiscount = getNumber(matchedVoucher?.discount);

        const transactionAmount = getNumber(
            transection_amount_ref.current?.value
        );

        const moreDiscountAmount = getNumber(
            more_discount_ref.current?.value
        );

        const newPaid = oldPaid + transactionAmount;
        const newDiscount = oldDiscount + moreDiscountAmount;

        const newDue = Math.max(
            0,
            oldDue - transactionAmount - moreDiscountAmount
        );

        const ticketPrice = getNumber(matchedVoucher?.ticket_price);

        const newStatus =
            newDue <= 0 || ticketPrice <= newPaid + newDiscount
                ? 'Paid'
                : 'Unpaid';

        return {
            transactionAmount: Number(transactionAmount.toFixed(2)),
            moreDiscountAmount: Number(
                moreDiscountAmount.toFixed(2)
            ),
            newPaid: Number(newPaid.toFixed(2)),
            newDiscount: Number(newDiscount.toFixed(2)),
            newDue: Number(newDue.toFixed(2)),
            newStatus
        };
    };

    /*
    |--------------------------------------------------------------------------
    | Payment Input Changes
    |--------------------------------------------------------------------------
    */

    const handleDiscountPaidChange = () => {
        const {
            newDiscount,
            newDue,
            newPaid
        } = calculatePayment();

        setDiscount(newDiscount);
        setDue(newDue);
        setPaid(newPaid);
    };

    const handlePaidChange = () => {
        const {
            newDiscount,
            newDue,
            newPaid
        } = calculatePayment();

        setDiscount(newDiscount);
        setDue(newDue);
        setPaid(newPaid);
    };

    /*
    |--------------------------------------------------------------------------
    | Print
    |--------------------------------------------------------------------------
    */

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
                <title>Air Ticket Voucher - ${voucher_no}</title>

                <link
                    href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
                    rel="stylesheet"
                >

                <style>
                    @page {
                        size: A4 landscape;
                    }

                    body {
                        font-family: sans-serif;
                        color: black;
                        display: flex;
                        justify-content: end;
                        width: 100%;
                    }

                    .voucher-wrapper {
                        width: 48%;
                        height: 100%;
                        box-sizing: border-box;
                        page-break-inside: avoid;
                    }
                </style>
            </head>

            <body>

                <div class="voucher-wrapper">
                    ${content}
                </div>

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

    /*
    |--------------------------------------------------------------------------
    | Take Payment
    |--------------------------------------------------------------------------
    */

    const handleTakePayment = (id) => {
        if (!matchedVoucher) {
            Swal.fire({
                icon: 'error',
                title: 'Voucher Not Found',
                text: 'Unable to process payment.',
                showConfirmButton: false,
                timer: 1500
            });

            return;
        }

        const {
            transactionAmount,
            moreDiscountAmount,
            newPaid,
            newDiscount,
            newDue,
            newStatus
        } = calculatePayment();

        /*
         * Prevent invalid payment
         */
        if (transactionAmount < 0 || moreDiscountAmount < 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Amount',
                text: 'Payment amount and discount cannot be negative.',
                confirmButtonColor: '#10b981'
            });

            return;
        }

        /*
         * Prevent taking more payment than due
         */
        if (
            transactionAmount + moreDiscountAmount >
            getNumber(matchedVoucher.due_amount)
        ) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Amount',
                text: 'Payment and discount cannot be greater than the current due amount.',
                confirmButtonColor: '#10b981'
            });

            return;
        }

        /*
         * Nothing entered
         */
        if (transactionAmount === 0 && moreDiscountAmount === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Enter Amount',
                text: 'Please enter a payment amount or additional discount.',
                showConfirmButton: false,
                timer: 1500
            });

            return;
        }

        const paymentDetails = {
            date: `${currentDate}, ${Time}`,

            reference_voucher: String(voucher_no),

            /*
             * Total paid amount after this payment
             */
            paid_amount: newPaid,

            /*
             * This is only the current transaction amount
             */
            transection_amount: transactionAmount,

            /*
             * Remaining due AFTER current payment + discount
             */
            due: newDue,

            /*
             * Status after current payment
             */
            payment_status: newStatus,

            voucher_no: String(voucher_no),

            /*
             * Total discount after this payment
             */
            discount: newDiscount
        };

        Swal.fire({
            title: 'Are you sure?',
            text: `You Are Taking a Payment From ${client?.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, I am Sure',
            background: '#071311',
            color: '#e2e8f0'
        }).then((result) => {

            if (!result.isConfirmed) return;

            fetch(
                `https://bismillah-enterprise-server.onrender.com/air_ticket_take_payment/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(paymentDetails)
                }
            )
                .then(async (res) => {
                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(
                            data?.message || 'Payment update failed'
                        );
                    }

                    return data;
                })
                .then((data) => {

                    if (!data?.success) {
                        throw new Error(
                            data?.message || 'Payment update failed'
                        );
                    }

                    if (more_discount_ref.current) {
                        more_discount_ref.current.value = '';
                    }

                    if (transection_amount_ref.current) {
                        transection_amount_ref.current.value = '';
                    }

                    setDiscount(newDiscount);
                    setPaid(newPaid);
                    setDue(newDue);
                    setModal(false);

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Payment Taking Successfully',
                        showConfirmButton: false,
                        timer: 1000
                    }).then(() => {
                        navigate(location.pathname);
                    });
                })
                .catch((error) => {
                    console.error('Payment Error:', error);

                    Swal.fire({
                        icon: 'error',
                        title: 'Payment Failed',
                        text:
                            error?.message ||
                            'Something went wrong while taking payment.',
                        confirmButtonColor: '#10b981'
                    });
                });
        });
    };

    /*
    |--------------------------------------------------------------------------
    | No Voucher
    |--------------------------------------------------------------------------
    */

    if (!matchedVoucher) {
        return (
            <div className="min-h-full flex items-center justify-center text-red-400">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">
                        Voucher not found.
                    </h1>

                    <Link
                        to={`/admin/air_ticket_client_details/${client?._id}`}
                        className="inline-block mt-5 px-5 py-2 rounded-xl border border-emerald-400/20 text-emerald-300"
                    >
                        Back
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">

            {/* =========================================================
                Payment Modal
            ========================================================= */}

            <div
                id="staff_details_modal"
                className={`
                    ${!modal ? 'hidden' : 'block'}
                    fixed z-[100]
                    w-[350px]
                    bg-[#071311]
                    border border-emerald-400/15
                    shadow-2xl shadow-emerald-400/10
                    rounded-2xl
                    top-1/2 left-1/2
                    transform -translate-x-1/2 -translate-y-1/2
                `}
            >

                <div className="flex justify-end -top-[10px] -right-[10px] relative">

                    <MdOutlineCancel
                        onClick={() => setModal(false)}
                        className="text-slate-200 text-3xl cursor-pointer hover:text-red-400 transition"
                    />

                </div>

                <div className="mb-4">

                    <h1 className="text-lg font-semibold text-emerald-300 text-center mb-2">
                        Payment Details
                    </h1>

                    <hr className="border-emerald-300/20 w-full" />

                </div>

                <div className="text-slate-200 flex flex-col gap-5 px-8 pt-0 pb-7 items-center h-full w-full">

                    <div className="mt-2 w-full">

                        <div className="flex items-center justify-between gap-4">

                            <h1 className="lg:text-lg font-semibold mb-2">
                                Bill: {matchedVoucher.ticket_price}
                            </h1>

                            <h1 className="lg:text-lg font-semibold mb-2">
                                Discount: {discount}
                            </h1>

                        </div>

                        <div className="flex items-center justify-between gap-4">

                            <h1 className="lg:text-lg font-semibold">
                                Paid: {paid}
                            </h1>

                            <h1
                                className={`lg:text-lg font-semibold ${due <= 0
                                    ? 'text-emerald-300'
                                    : 'text-slate-200'
                                    }`}
                            >
                                Due: {due}
                            </h1>

                        </div>

                    </div>

                    {/* More Discount */}

                    <div className="w-full">

                        <h1 className="lg:text-lg font-semibold mb-2">
                            More Discount
                        </h1>

                        <div className="px-3 border-2 border-emerald-400/20 rounded-xl h-8 shadow-2xl shadow-emerald-400/10 w-full bg-white">

                            <NumericFormat
                                defaultValue={0}
                                getInputRef={more_discount_ref}
                                onChange={handleDiscountPaidChange}
                                className="outline-none w-full h-full text-black bg-transparent"
                                placeholder="Enter Amount"
                                allowNegative={false}
                                decimalScale={2}
                                fixedDecimalScale={false}
                                thousandSeparator={false}
                            />

                        </div>

                    </div>

                    {/* Transaction Amount */}

                    <div className="w-full">

                        <h1 className="lg:text-lg font-semibold mb-2">
                            Transection Amount
                        </h1>

                        <div className="px-3 border-2 border-emerald-400/20 rounded-xl h-8 shadow-2xl shadow-emerald-400/10 w-full bg-white">

                            <NumericFormat
                                defaultValue={0}
                                getInputRef={transection_amount_ref}
                                onChange={handlePaidChange}
                                className="outline-none w-full h-full text-black bg-transparent"
                                placeholder="Enter Amount"
                                allowNegative={false}
                                decimalScale={2}
                                fixedDecimalScale={false}
                                thousandSeparator={false}
                            />

                        </div>

                    </div>

                    <button
                        onClick={() =>
                            handleTakePayment(client._id)
                        }
                        className="text-slate-200 cursor-pointer rounded-xl border border-emerald-400/15 bg-gradient-to-r from-emerald-400/10 to-cyan-400/[0.04] shadow-[0_8px_25px_rgba(16,185,129,0.08)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.16)] px-5 py-1 text-lg font-semibold mb-5 lg:mb-0 transition"
                    >
                        Submit
                    </button>

                </div>
            </div>

            {/* =========================================================
                Main Voucher
            ========================================================= */}

            <div onClick={() => setModal(false)}>

                {/* Back Button */}

                <div className="flex items-center justify-start">

                    <Link
                        to={`/admin/air_ticket_client_details/${client._id}`}
                    >

                        <button
                            className="
                                hidden md:block
                                text-slate-200
                                cursor-pointer
                                rounded-xl
                                border border-emerald-400/15
                                bg-gradient-to-r
                                from-emerald-400/10
                                to-cyan-400/[0.04]
                                shadow-[0_8px_25px_rgba(16,185,129,0.08)]
                                hover:shadow-[0_12px_35px_rgba(16,185,129,0.16)]
                                px-5 py-1
                                text-md lg:text-lg
                                font-semibold
                                transition
                            "
                        >
                            Back
                        </button>

                    </Link>

                </div>

                {/* Voucher Title */}

                <div className="flex items-center justify-center nunito">

                    <h1 className="nunito md:text-2xl text-center font-bold px-5 text-emerald-300">

                        Voucher - {voucher_no}

                    </h1>

                </div>

                {/* Client Information */}

                <div className="flex items-center justify-center">

                    <div className="text-xs md:text-lg font-semibold grid grid-cols-2 text-slate-200 sm:min-w-[70%]">

                        <div>

                            <h1>
                                Name: {client.name}
                            </h1>

                            <h1>
                                Mobile No: {client.mobile_no}
                            </h1>

                            <h1>
                                Date of Birth: {client.date_of_birth}
                            </h1>

                            <h1>
                                Address: {client.address}
                            </h1>

                        </div>

                        <div className="flex justify-end">

                            <div>

                                <h1>
                                    Date: {matchedVoucher.date}
                                </h1>

                                <h1>
                                    Passport No: {client.passport_no}
                                </h1>

                                <h1>
                                    Date of Expiry: {client.date_of_expiry}
                                </h1>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Voucher Table */}

                <div
                    className={`
                        ${isEdit ? 'hidden' : 'flex'}
                        items-center
                        sm:justify-center
                        mt-5
                        overflow-x-scroll
                        sm:overflow-x-hidden
                        overflow-y-hidden
                        scrollbar-hide
                        text-xs lg:text-lg
                    `}
                >

                    <table className="text-slate-200 min-w-[380px] sm:min-w-[100%]">

                        <thead>

                            <tr className="text-emerald-300">

                                <th className="border border-white/20 p-2">
                                    Destination
                                </th>

                                <th className="border border-white/20 p-2">
                                    Flight Date
                                </th>

                                <th className="border border-white/20 p-2">
                                    Ticket Price
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                <td className="p-2 border border-white/20">
                                    {matchedVoucher.destination}
                                </td>

                                <td className="p-2 border border-white/20">
                                    {matchedVoucher.flight_date}
                                </td>

                                <td className="p-2 border border-white/20">
                                    {matchedVoucher.ticket_price}
                                </td>

                            </tr>

                            <tr className="text-right font-semibold text-emerald-300">

                                <td className="p-2 border border-white/20" />

                                <td className="p-2 border border-white/20">
                                    Discount
                                </td>

                                <td className="p-2 border border-white/20 text-right">
                                    {matchedVoucher.discount}
                                </td>

                            </tr>

                            <tr className="text-right font-semibold text-emerald-300">

                                <td className="p-2 border border-white/20" />

                                <td className="p-2 border border-white/20">
                                    Paid Amount
                                </td>

                                <td className="p-2 border border-white/20 text-right">
                                    {matchedVoucher.paid_amount}
                                </td>

                            </tr>

                            <tr className="text-right font-semibold text-emerald-300">

                                <td className="p-2 border border-white/20 text-center">
                                    {matchedVoucher.payment_status}
                                </td>

                                <td className="p-2 border border-white/20">
                                    Due Amount
                                </td>

                                <td className="p-2 border border-white/20 text-right">
                                    {matchedVoucher.due_amount}
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

            {/* =========================================================
                Action Buttons
            ========================================================= */}

            <div className="flex flex-col items-center justify-center gap-5 mt-8 mb-10">

                <div className="flex items-center justify-center gap-5">

                    <button
                        onClick={() => setModal(true)}
                        disabled={
                            matchedVoucher.due_amount < 1 ||
                            isEdit
                        }
                        className={`
                            ${isEdit ? 'hidden' : 'block'}
                            disabled:cursor-not-allowed
                            disabled:bg-gray-400
                            disabled:opacity-60
                            text-slate-200
                            cursor-pointer
                            rounded-xl
                            border border-emerald-400/15
                            bg-gradient-to-r
                            from-emerald-400/10
                            to-cyan-400/[0.04]
                            shadow-[0_8px_25px_rgba(16,185,129,0.08)]
                            hover:shadow-[0_12px_35px_rgba(16,185,129,0.16)]
                            px-5 py-1
                            text-md lg:text-lg
                            font-semibold
                            transition
                        `}
                    >
                        Take A Payment
                    </button>

                    <button
                        onClick={handlePrint}
                        className={`
                            ${isEdit ? 'hidden' : 'block'}
                            disabled:cursor-not-allowed
                            disabled:bg-gray-400
                            disabled:opacity-60
                            text-slate-200
                            cursor-pointer
                            rounded-xl
                            border border-emerald-400/15
                            bg-gradient-to-r
                            from-emerald-400/10
                            to-cyan-400/[0.04]
                            shadow-[0_8px_25px_rgba(16,185,129,0.08)]
                            hover:shadow-[0_12px_35px_rgba(16,185,129,0.16)]
                            px-5 py-1
                            text-md lg:text-lg
                            font-semibold
                            transition
                        `}
                    >
                        Print
                    </button>

                </div>

            </div>

            {/* =========================================================
                PRINT VERSION
            ========================================================= */}

            <div
                ref={voucherPrintRef}
                className="nunito w-[550px] hidden"
            >
                <AirTicketVoucherHeading />

                <div className="flex items-center justify-center">

                    <div className="text-sm font-semibold grid grid-cols-2 text-black w-full">

                        <div>
                            <h1>Name: {client.name}</h1>
                            <h1>Mobile No: {client.mobile_no}</h1>
                            <h1>Date of Birth: {client.date_of_birth}</h1>
                            <h1>Address: {client.address}</h1>
                        </div>

                        <div className="flex justify-end">

                            <div>
                                <h1>Date: {matchedVoucher.date}</h1>
                                <h1>Passport No: {client.passport_no}</h1>
                                <h1>Date of Expiry: {client.date_of_expiry}</h1>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="flex items-center justify-center nunito">

                    <h1 className="nunito text-xl text-center font-bold px-5 text-black">
                        Voucher - {voucher_no}
                    </h1>

                </div>

                <div className="flex items-center justify-center mt-1 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-md">

                    <div className="absolute w-full flex items-center justify-center">

                        <div>
                            <h1 className="text-7xl font-bold opacity-20">
                                {matchedVoucher.payment_status}
                            </h1>
                        </div>

                    </div>

                    <table className="text-black w-full border-collapse">

                        <thead>

                            <tr className="text-black">

                                <th className="border border-black p-2">
                                    Destination
                                </th>

                                <th className="border border-black p-2">
                                    Flight Date
                                </th>

                                <th className="border border-black p-2">
                                    Ticket Price
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                <td className="border border-black p-2 text-center">
                                    {matchedVoucher.destination}
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {matchedVoucher.flight_date}
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {matchedVoucher.ticket_price}
                                </td>

                            </tr>

                            <tr className="text-right font-semibold">

                                <td className="p-2 border border-black">
                                    &nbsp;
                                </td>

                                <td className="p-2 border border-black">
                                    Discount
                                </td>

                                <td className="p-2 border border-black text-center">
                                    {matchedVoucher.discount}
                                </td>

                            </tr>

                            <tr className="text-right font-semibold">

                                <td className="p-2 border border-black">
                                    &nbsp;
                                </td>

                                <td className="p-2 border border-black">
                                    Paid Amount
                                </td>

                                <td className="p-2 border border-black text-center">
                                    {matchedVoucher.paid_amount}
                                </td>

                            </tr>

                            <tr className="text-right font-semibold">

                                <td className="p-2 border border-black text-center">
                                    {matchedVoucher.payment_status}
                                </td>

                                <td className="p-2 border border-black">
                                    Due Amount
                                </td>

                                <td className="p-2 border border-black text-center">
                                    {matchedVoucher.due_amount}
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

                <div className="flex items-center justify-between mt-20 text-xs absolute bottom-0 w-1/2">

                    <div className="border-t-2 border-black pt-1 w-fit px-5 ml-4">
                        <h1>Buyer Sign</h1>
                    </div>

                    <div className="border-t-2 border-black pt-1 w-fit px-5 mr-8">
                        <h1>Seller Sign</h1>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default AirTicketVoucher;