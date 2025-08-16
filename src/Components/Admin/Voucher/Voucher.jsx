import React, { useRef, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { NumberFormatBase, NumericFormat } from 'react-number-format';
import { Link, useLoaderData, useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import VoucherHeading from '../../Shared/VoucherHeading/VoucherHeading';

const Voucher = () => {
    const { voucher_no } = useParams();
    const client = useLoaderData();
    const [isEdit, setIsEdit] = useState(false);
    const matchedVoucher = client.vouchers.find(
        (voucher) => parseInt(voucher.voucher_no) === parseInt(voucher_no)
    );
    const [discount, setDiscount] = useState(matchedVoucher?.discount);
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


    // Add new products functions


    const [products, setProducts] = useState([
        ...matchedVoucher.products
    ]);
    const [voucher_calculation, set_voucher_calculation] = useState({

    })
    let totalBill = products.reduce((sum, item) => sum + item.total, 0);

    const discount_amount_ref = useRef();
    const paid_amount_ref = useRef();
    const status_ref = useRef();
    // Handle input change for each field

    const handleChange = (index, field, value) => {
        const newProducts = [...products];
        newProducts[index][field] = value;

        // auto-calculate total
        const quantity = parseFloat(newProducts[index].quantity || 0);
        const rate = parseFloat(newProducts[index].rate || 0);
        newProducts[index].total = parseFloat((quantity * rate).toFixed(2));

        setProducts(newProducts);
    };
    // updated code

    const total = totalBill; // Replace this with your actual total bill

    const [Ndiscount, setNDiscount] = useState(0);
    const [Npaid, setNPaid] = useState(0);
    const [Ndue, setNDue] = useState(total);
    const [status, setStatus] = useState('Unpaid');
    // updated code


    const handleDeleteRow = (indexNo) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You Are Deleting A Row`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I am Sure"
        }).then((result) => {
            if (result.isConfirmed) {
                const allProducts = [...products]
                allProducts.splice(parseInt(indexNo), 1);
                setProducts(allProducts)
            }
        })
    }
    // Add new product row
    const addProduct = () => {
        setIsEdit(true);
        setProducts([...products, { product_name: '', quantity: '', rate: '', total: 0 }]);
    };
    const handleNChange = (index, field, value) => {
        const newProducts = [...products];
        newProducts[index][field] = value;

        // auto-calculate total
        const quantity = parseFloat(newProducts[index].quantity || 0);
        const rate = parseFloat(newProducts[index].rate || 0);
        newProducts[index].total = parseFloat((quantity * rate).toFixed(2));

        setProducts(newProducts);
    };
    const handleEditVoucher = (vn) => {
        const voucher = {
            voucher_no: vn,
            products,
            total: parseFloat(totalBill.toFixed(2)),
            due_amount: parseFloat((totalBill - matchedVoucher.paid_amount - matchedVoucher.discount).toFixed(2)),
            status: `${due > 0 ? 'Unpaid' : 'Paid'}`
        }
        Swal.fire({
            title: "Are you sure?",
            text: `You Are Adding Those Items`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I am Sure"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://bismillah-enterprise-server.onrender.com/edit_voucher/${client._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(voucher)
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.acknowledged) {
                            navigate(location?.pathname);
                            setIsEdit(false);
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Voucher Edited Successfully",
                                showConfirmButton: false,
                                timer: 1000
                            })
                        }
                    })
            }
        })
    }

    // End Add new products functions
    const transection_amount_ref = useRef();
    const payment_status_ref = useRef();
    const more_discount_ref = useRef();
    const voucherPrintRef = useRef();

    const handleDiscountPaidChange = () => {
        const discountVal = parseFloat(more_discount_ref.current.value || 0);
        const totalDiscount = parseFloat(matchedVoucher.discount + discountVal)
        const totalDue = parseFloat(matchedVoucher.due_amount - discountVal)
        setDiscount(parseFloat(totalDiscount.toFixed(2)));
        setDue(parseFloat(totalDue.toFixed(2)));
    };
    const handlePaidChange = () => {
        const paidVal = parseFloat(transection_amount_ref.current.value || 0);
        const totalPaid = parseFloat(matchedVoucher.paid_amount + paidVal)
        setPaid(parseFloat(totalPaid.toFixed(2)));
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
            payment_status: matchedVoucher.total <= (discount + paid) ? 'Paid' : 'Unpaid',
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
                fetch(`https://bismillah-enterprise-server.onrender.com/take_payment/${id}`, {
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
                            <h1 className='lg:text-lg font-semibold mb-2'>Bill: {matchedVoucher.total}</h1>
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
                                defaultValue={0}
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
                    <Link to={`/admin/client_details/${client._id}`}>
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
                            <h1>Address: {client.address}</h1>
                        </div>
                        <div className='flex justify-end'>
                            <div>
                                <h1>Date: {matchedVoucher.date}</h1>
                                <h1>Mobile No: {client.mobile_no}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${isEdit ? 'hidden' : 'flex'} items-center sm:justify-center mt-5 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg`}>
                    {matchedVoucher ? (
                        <table className="text-pink-200 min-w-[380px] sm:min-w-[100%]">
                            <thead>
                                <tr className="text-pink-300">
                                    <th className="p-2 border">SL</th>
                                    <th className="p-2 border">Product Name</th>
                                    <th className="p-2 border">Quantity</th>
                                    <th className="p-2 border">Rate</th>
                                    <th className="p-2 border">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matchedVoucher.products?.map((product, index) => (
                                    <tr key={index}>
                                        <td className="p-2 border">{index + 1}</td>
                                        <td className="p-2 border">{product.product_name}</td>
                                        <td className="p-2 border">{product.quantity}</td>
                                        <td className="p-2 border">
                                            {product.rate}
                                        </td>
                                        <td className="p-2 border">{product.total}</td>
                                    </tr>
                                ))}
                                <tr className='font-semibold text-pink-300'>
                                    <td className="p-2 border" colSpan={3}></td>
                                    <td className="p-2 border text-right">Total Bill</td>
                                    <td className="p-2 border">{matchedVoucher.total}</td>
                                </tr>
                                <tr className="text-right font-semibold text-pink-300">
                                    <td colSpan="3" className="p-2 border"></td>
                                    <td className="p-2 border">Discount</td>
                                    <td className="p-2 border text-right">
                                        {matchedVoucher.discount}
                                    </td>
                                </tr>
                                <tr className="text-right font-semibold text-pink-300">
                                    <td colSpan="3" className="p-2 border"></td>
                                    <td className="p-2 border">Paid Amount</td>
                                    <td className="p-2 border text-right">
                                        {matchedVoucher.paid_amount}
                                    </td>
                                </tr>

                                <tr className="text-right font-semibold text-pink-300">
                                    <td colSpan="3" className="p-2 border text-center">{matchedVoucher.payment_status}</td>
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
                {/* -------------- Add more products */}


                <div className={`${!isEdit ? 'hidden' : 'flex'} flex-col items-center sm:justify-center mt-5 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg`}>
                    <table className="text-pink-200 min-w-[380px] sm:min-w-[100%]">
                        <thead>
                            <tr className="text-pink-300">
                                <th className="border p-2"></th>
                                <th className="border p-2">SL</th>
                                <th className="border p-2">Product</th>
                                <th className="border p-2">Qty</th>
                                <th className="border p-2">Rate</th>
                                <th className="border p-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products?.map((item, index) => (
                                <tr key={index}>
                                    <td onClick={() => { handleDeleteRow(index) }} className="p-2 cursor-pointer text-red-500">
                                        -
                                    </td>
                                    <td className="p-2">
                                        {index + 1}
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={item.product_name}
                                            onChange={(e) => handleNChange(index, 'product_name', e.target.value)}
                                            className="w-full p-1 outline-none"
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <NumericFormat
                                            value={item.quantity}
                                            onChange={(e) => handleNChange(index, 'quantity', e.target.value)}
                                            className='outline-none w-full h-full'
                                            placeholder='Enter Qantity'
                                            allowNegative={false}
                                            decimalScale={2}
                                            fixedDecimalScale={false}
                                            thousandSeparator={false}
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <NumericFormat
                                            value={item.rate}
                                            onValueChange={(values) => handleNChange(index, 'rate', values.floatValue)}
                                            className="outline-none w-full h-full"
                                            placeholder="Enter Rate"
                                            allowNegative={false}
                                            decimalScale={2}
                                            fixedDecimalScale={false}
                                            thousandSeparator={false}
                                        />
                                    </td>
                                    <td className="border p-2 text-right">{item.total.toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr className="text-right font-semibold">
                                <td colSpan="4" className="p-2 border"></td>
                                <td className="p-2 border">Total Bill</td>
                                <td className="p-2 border text-right min-w-[120px]">{totalBill.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    {/* <p onClick={handleDeleteRow} className='text-xs underline text-pink-400 mt-2 cursor-pointer'>Delete Last Row</p> */}
                </div>



                {/* -------------- End Add more products */}
            </div>


            <div className='flex flex-col items-center justify-center gap-5 mt-8 mb-10'>
                <div className='flex items-center justify-center gap-5'>
                    <button onClick={() => { setModal(true) }} disabled={matchedVoucher.due_amount < 1 || isEdit} className={`${isEdit ? 'hidden' : 'block'} disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold`}>
                        Take A Payment
                    </button>
                    <button onClick={addProduct} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                        + Add More Products
                    </button>
                    <button onClick={() => { handleEditVoucher(voucher_no) }} className={`${isEdit ? 'block' : 'hidden'} text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold`}>
                        Done
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
                            <h1>Address: {client.address}</h1>
                        </div>
                        <div className='flex justify-end'>
                            <div>
                                <h1>Date: {matchedVoucher.date}</h1>
                                <h1>Mobile No: {client.mobile_no}</h1>
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
                                <th className="p-2 border">SL</th>
                                <th className="p-2 border">Product Name</th>
                                <th className="p-2 border">Quantity</th>
                                <th className="p-2 border">Rate</th>
                                <th className="p-2 border">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matchedVoucher.products?.map((product, index) => (
                                <tr key={index}>
                                    <td className="p-2 border">{index + 1}</td>
                                    <td className="p-2 border">{product.product_name}</td>
                                    <td className="p-2 border">{product.quantity}</td>
                                    <td className="p-2 border">
                                        {product.rate}
                                    </td>
                                    <td className="p-2 border text-center">{product.total}</td>
                                </tr>
                            ))}
                            <tr className='text-black'>
                                <td className="p-2 border" colSpan={3}></td>
                                <td className="p-2 border text-right">Total Bill</td>
                                <td className="p-2 border text-center">{matchedVoucher.total}</td>
                            </tr>
                            <tr className="text-right font-semibold">
                                <td colSpan="3" className="p-2 border"></td>
                                <td className="p-2 border">Discount</td>
                                <td className="p-2 border text-center">
                                    {matchedVoucher.discount}
                                </td>
                            </tr>
                            <tr className="text-right font-semibold">
                                <td colSpan="3" className="p-2 border"></td>
                                <td className="p-2 border">Paid Amount</td>
                                <td className="p-2 border text-center">
                                    {matchedVoucher.paid_amount}
                                </td>
                            </tr>

                            <tr className="text-right font-semibold">
                                <td colSpan="3" className="p-2 border text-center">{matchedVoucher.payment_status}</td>
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

export default Voucher;