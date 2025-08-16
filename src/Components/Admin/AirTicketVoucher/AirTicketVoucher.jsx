import React, { useRef, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { NumberFormatBase, NumericFormat } from 'react-number-format';
import { Link, useLoaderData, useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import VoucherHeading from '../../Shared/VoucherHeading/VoucherHeading';

const AirTicketVoucher = () => {
    const { voucher_no } = useParams();
    const client = useLoaderData();
    const [isEdit, setIsEdit] = useState(false);
    const matchedVoucher = client.vouchers.find(
        (voucher) => parseInt(voucher.voucher_no) === parseInt(voucher_no)
    );
    const [discount, setDiscount] = useState(matchedVoucher.discount);
    const [due, setDue] = useState(matchedVoucher.due_amount);
    const [paid, setPaid] = useState(matchedVoucher.paid_amount);
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

    const handleDiscountPaidChange = () => {
        const discountVal = parseFloat(more_discount_ref.current.value || 0);
        const paidVal = parseFloat(transection_amount_ref.current.value || 0);
        const totalDiscount = parseFloat(matchedVoucher.discount + discountVal)
        const totalDue = parseFloat(matchedVoucher.due_amount - discountVal - paidVal)
        setDiscount(parseFloat(totalDiscount.toFixed(2)));
        setDue(parseFloat(totalDue.toFixed(2)));
    };
    const handlePaidChange = () => {
        const discountVal = parseFloat(more_discount_ref.current.value || 0);
        const paidVal = parseFloat(transection_amount_ref.current.value || 0);
        const totalPaid = parseFloat(matchedVoucher.paid_amount + paidVal);
        const totalDue = parseFloat(matchedVoucher.due_amount - paidVal - discountVal)
        setPaid(parseFloat(totalPaid.toFixed(2)));
        setDue(parseFloat(totalDue.toFixed(2)));
    };

    const handlePrint = () => {
        const content = voucherPrintRef.current.innerHTML;

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
          <title>Print</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: sans-serif; color: black; }
          </style>
        </head>
        <body>
          ${content}
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
    const handleTakePayment = (id) => {
        const transectionAmount = parseFloat(transection_amount_ref.current.value).toFixed(2);
        const moreDiscountAmount = parseFloat(more_discount_ref.current.value).toFixed(2);
        const paymentDetails = {
            date: `${currentDate}, ${Time}`,
            reference_voucher: voucher_no,
            paid_amount: paid,
            transection_amount: parseFloat(transectionAmount),
            due: parseFloat((matchedVoucher.due_amount - transectionAmount - moreDiscountAmount).toFixed(2)),
            payment_status: matchedVoucher.ticket_price <= (discount + paid) ? 'Paid' : 'Unpaid',
            voucher_no: `${voucher_no}`,
            discount: discount
        }
        Swal.fire({
            title: "Are you sure?",
            text: `You Are Taking a Payment From ${client?.name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I am Sure"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://bismillah-enterprise-server.onrender.com/air_ticket_take_payment/${id}`, {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(paymentDetails)
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            more_discount_ref.current.value = '';
                            transection_amount_ref.current.value = '';
                            setModal(!modal);
                            navigate(location.pathname)
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Payment Taking Successfully',
                                showConfirmButton: false,
                                timer: 1000,
                            })
                        }
                    })
            }

        })
    }
    return (
        <div className='relative'>
            {/* modal */}
            <div id='staff_details_modal' className={`${!modal ? 'hidden' : 'block'}  w-[350px] bg-black shadow-md shadow-pink-200 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
                <div className='flex justify-end -top-[10px] -right-[10px] relative'>
                    <MdOutlineCancel onClick={() => { !setModal(!modal) }} className='text-pink-200 text-3xl cursor-pointer'></MdOutlineCancel>
                </div>
                <div className='mb-4'>
                    <h1 className='text-lg font-semibold text-pink-300 text-center mb-2'>Payment Details</h1>
                    <hr className='text-pink-300 w-full' />
                </div>
                <div className='text-pink-200 flex flex-col gap-5 px-8 pt-0 pb-7 items-center h-full w-full'>
                    <div className='mt-2 w-full'>
                        <div className='flex items-center justify-between'>
                            <h1 className='lg:text-lg font-semibold mb-2'>Bill: {matchedVoucher.ticket_price}</h1>
                            <h1 className='lg:text-lg font-semibold mb-2'>Discount: {discount}</h1>
                        </div>
                        <div className='flex items-center justify-between'>
                            <h1 className='lg:text-lg font-semibold'>Paid: {paid}</h1>
                            <h1 className='lg:text-lg font-semibold'>Due: {due}</h1>
                        </div>
                    </div>
                    <div className='w-full'>
                        <h1 className='lg:text-lg font-semibold mb-2'>More Discount</h1>
                        <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 w-full'>
                            <NumericFormat
                                getInputRef={more_discount_ref}
                                onChange={handleDiscountPaidChange}
                                className="outline-none w-full h-full"
                                placeholder="Enter Amount"
                                allowNegative={false}
                                decimalScale={2}
                                fixedDecimalScale={false}
                                thousandSeparator={false}
                            />
                        </div>
                    </div>
                    <div className='w-full'>
                        <h1 className='lg:text-lg font-semibold mb-2'>Transection Amount</h1>
                        <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 w-full'>
                            <NumericFormat
                                getInputRef={transection_amount_ref}
                                onChange={handlePaidChange}
                                className="outline-none w-full h-full"
                                placeholder="Enter Amount"
                                allowNegative={false}
                                decimalScale={2}
                                fixedDecimalScale={false}
                                thousandSeparator={false}
                            />
                        </div>
                    </div>
                    <button onClick={() => handleTakePayment(client._id)} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold mb-5 lg:mb-0'>Submit</button>
                </div>
            </div>
            {/* end modal */}
            <div onClick={() => { setModal(false) }}>
                <div className='flex items-center justify-start'>
                    <Link to={`/admin/air_ticket_client_details/${client._id}`}>
                        <button className="hidden md:block text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                            Back
                        </button>
                    </Link>
                </div>
                <div className='flex items-center justify-center nunito'>
                    <h1 className="nunito md:text-2xl text-center font-bold px-5 text-pink-300">
                        Voucher - {voucher_no}
                    </h1>
                </div>
                <div className='flex items-center justify-center'>
                    <div className='text-xs md:text-lg font-semibold grid grid-cols-2 text-pink-200 sm:min-w-[70%]'>
                        <div className=''>
                            <h1>Name: {client.name}</h1>
                            <h1>Mobile No: {client.mobile_no}</h1>
                            <h1>Date of Birth: {client.date_of_birth}</h1>
                            <h1>Address: {client.address}</h1>
                        </div>
                        <div className='flex justify-end'>
                            <div>
                                <h1>Date: {matchedVoucher.date}</h1>
                                <h1>Passport No: {client.passport_no}</h1>
                                <h1>Date of Expiry: {client.date_of_expiry}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${isEdit ? 'hidden' : 'flex'} items-center sm:justify-center mt-5 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg`}>
                    {matchedVoucher ? (
                        <table className="text-pink-200 min-w-[380px] sm:min-w-[100%]">
                            <thead>
                                <tr className="text-pink-300">
                                    <th className="border p-2">Destination</th>
                                    <th className="border p-2">Flight Date</th>
                                    <th className="border p-2">Ticket Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-2 border">{matchedVoucher.destination}</td>
                                    <td className="p-2 border">{matchedVoucher.flight_date}</td>
                                    <td className="p-2 border">{matchedVoucher.ticket_price}</td>
                                </tr>
                                <tr className="text-right font-semibold text-pink-300">
                                    <td className="p-2 border"></td>
                                    <td className="p-2 border">Discount</td>
                                    <td className="p-2 border text-right">
                                        {matchedVoucher.discount}
                                    </td>
                                </tr>
                                <tr className="text-right font-semibold text-pink-300">
                                    <td className="p-2 border"></td>
                                    <td className="p-2 border">Paid Amount</td>
                                    <td className="p-2 border text-right">
                                        {matchedVoucher.paid_amount}
                                    </td>
                                </tr>

                                <tr className="text-right font-semibold text-pink-300">
                                    <td className="p-2 border text-center">{matchedVoucher.payment_status}</td>
                                    <td className="p-2 border">Due Amount</td>
                                    <td className="p-2 border text-right">
                                        {matchedVoucher.due_amount}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    ) : (
                        <p className="text-red-600 mt-4">Voucher not found.</p>
                    )}
                </div>
            </div>


            <div className='flex flex-col items-center justify-center gap-5 mt-8 mb-10'>
                <div className='flex items-center justify-center gap-5'>
                    <button onClick={() => { setModal(true) }} disabled={matchedVoucher.due_amount < 1 || isEdit} className={`${isEdit ? 'hidden' : 'block'} disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold`}>
                        Take A Payment
                    </button>
                    <button onClick={handlePrint} className={`${isEdit ? 'hidden' : 'block'} disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold`}>
                        Print
                    </button>
                </div>
            </div>
            <div ref={voucherPrintRef} className='nunito w-[550px] hidden'>
                <VoucherHeading></VoucherHeading>
                <div className='flex items-center justify-center'>
                    <div className='text-sm font-semibold grid grid-cols-2 text-black w-full'>
                        <div className=''>
                            <h1>Name: {client.name}</h1>
                            <h1>Mobile No: {client.mobile_no}</h1>
                            <h1>Date of Birth: {client.date_of_birth}</h1>
                            <h1>Address: {client.address}</h1>
                        </div>
                        <div className='flex justify-end'>
                            <div>
                                <h1>Date: {matchedVoucher.date}</h1>
                                <h1>Passport No: {client.passport_no}</h1>
                                <h1>Date of Expiry: {client.date_of_expiry}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-center nunito'>
                    <h1 className="nunito text-xl text-center font-bold px-5 text-black">
                        Voucher - {voucher_no}
                    </h1>
                </div>
                <div className="flex items-center justify-center mt-1 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-md">
                    <div className='absolute w-full flex items-center justify-center'>
                        <div className=''>
                            <h1 className='text-7xl font-bold opacity-20'>{matchedVoucher.payment_status}</h1>
                        </div>
                    </div>
                    <table className="text-black w-full">
                        <thead>
                            <tr className="text-black">
                                <th className="border p-2 text-center">Destination</th>
                                <th className="border p-2 text-center">Flight Date</th>
                                <th className="border p-2 text-center">Ticket Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2 border text-center">{matchedVoucher.destination}</td>
                                <td className="p-2 border text-center">{matchedVoucher.flight_date}</td>
                                <td className="p-2 border text-center">{matchedVoucher.ticket_price}</td>
                            </tr>
                            <tr className="text-right font-semibold text-black">
                                <td className="p-2 border"></td>
                                <td className="p-2 border">Discount</td>
                                <td className="p-2 border text-center">
                                    {matchedVoucher.discount}
                                </td>
                            </tr>
                            <tr className="text-right font-semibold text-black">
                                <td className="p-2 border"></td>
                                <td className="p-2 border">Paid Amount</td>
                                <td className="p-2 border text-center">
                                    {matchedVoucher.paid_amount}
                                </td>
                            </tr>
                            <tr className="text-right font-semibold text-black">
                                <td className="p-2 border text-center">{matchedVoucher.payment_status}</td>
                                <td className="p-2 border">Due Amount</td>
                                <td className="p-2 border text-center">
                                    {matchedVoucher.due_amount}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className='flex items-center justify-between mt-20'>
                    <div className='border-t-2 pt-1 w-fit px-5'>
                        <h1>Buyer Sign</h1>
                    </div>
                    <div className='border-t-2 pt-1 w-fit px-5'>
                        <h1>Seller Sign</h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AirTicketVoucher;