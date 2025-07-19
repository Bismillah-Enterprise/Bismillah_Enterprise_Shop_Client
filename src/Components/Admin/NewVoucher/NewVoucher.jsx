import React, { useEffect, useRef, useState } from 'react';
import { NumberFormatBase, NumericFormat } from 'react-number-format';
import { data, Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const NewVoucher = () => {
    const client = useLoaderData();
    const location = useLocation();
    const from = location?.state?.pathname;
    const [voucherSl, setVoucherSl] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        fetch('https://bismillah-enterprise-server.onrender.com/voucher_sl')
            .then(res => res.json())
            .then(data => {
                setVoucherSl(data.sl_no)
            })
    }, [])
    const toBanglaNumber = (input) => {
        const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return input.toString().split('').map(char => {
            return /\d/.test(char) ? banglaDigits[char] : char;
        }).join('');
    };
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
    const [products, setProducts] = useState([
        { product_name: '', quantity: '', rate: '', total: 0 },
    ]);
    const [voucher_calculation, set_voucher_calculation] = useState({

    })
    const totalBill = products.reduce((sum, item) => sum + item.total, 0);

    const discount_amount_ref = useRef();
    const paid_amount_ref = useRef();
    const status_ref = useRef();
    const voucherPrintRef = useRef();

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

    const [discount, setDiscount] = useState(0);
    const [paid, setPaid] = useState(0);
    const [due, setDue] = useState(total);
    const [status, setStatus] = useState('Unpaid');


    const handleDiscountPaidChange = () => {
        const discountVal = parseFloat((discount_amount_ref.current.value) || 0);
        const paidVal = parseFloat(paid_amount_ref.current.value || 0);
        const calculatedDue = total - discountVal - paidVal;
        setStatus(calculatedDue > 0 ? 'Unpaid' : 'Paid')
        setDiscount(discountVal);
        setPaid(paidVal);
        setDue(calculatedDue > 0 ? parseFloat(calculatedDue.toFixed(2)) : 0);
    };
    // updated code

    // Add new product row
    const addProduct = () => {
        setProducts([...products, { product_name: '', quantity: '', rate: '', total: 0 }]);
    };
    // Send all product data to your backend
    const handleSubmit = async () => {
        const newSlNo = voucherSl + 1;
        const discountAmount = parseFloat(discount_amount_ref.current.value || '0');
        // console.log(discountAmount);
        const voucher = {
            date: `${currentDate}, ${Time}`,
            voucher_no: newSlNo,
            products,
            total: parseFloat(totalBill.toFixed(2)),
            paid_amount: parseFloat(paid_amount_ref.current.value) || 0,
            due_amount: parseFloat(paid || discount ? due.toFixed(2) : totalBill.toFixed(2)),
            payment_status: status,
            discount: discountAmount
        }
        Swal.fire({
            title: "Are you sure?",
            text: `You Are Creating a New Voucher`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I am Sure"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5000/new_voucher/${client._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(voucher)
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.acknowledged) {
                            if (paid > 0) {
                                const paymentDetails = {
                                    date: `${currentDate}, ${Time}`,
                                    reference_voucher: voucherSl + 1,
                                    paid_amount: paid,
                                    due: parseFloat(paid || discount ? due.toFixed(2) : totalBill.toFixed(2)),
                                    payment_status: status,
                                    voucher_no: `${voucherSl + 1}`,
                                    discount: discountAmount
                                }
                                fetch(`https://bismillah-enterprise-server.onrender.com/take_payment/${client._id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'content-type': 'application/json'
                                    },
                                    body: JSON.stringify(paymentDetails)
                                })
                                    .then(res => res.json())
                                    .then(data => {
                                        if (data.success) {
                                            navigate(from)
                                            Swal.fire({
                                                position: 'center',
                                                icon: 'success',
                                                title: 'Payment Taking Successfully',
                                                showConfirmButton: false,
                                                timer: 1000,
                                            })
                                        }
                                    })
                                // ----------------------------
                            }
                            fetch(`https://bismillah-enterprise-server.onrender.com/voucher_sl`, {
                                method: 'POST',
                                headers: { 'content-type': 'application/json' },
                                body: JSON.stringify({ new_sl_no: newSlNo })
                            })
                                .then(slres => slres.json())
                                .then(slData => {
                                    if (slData.message === 'new sl set successfully') {
                                        setProducts([{ product_name: '', quantity: '', rate: '', total: 0 }]);
                                        navigate(location?.state?.pathname);
                                        Swal.fire({
                                            position: "center",
                                            icon: "success",
                                            title: "Voucher Added Successfully",
                                            showConfirmButton: false,
                                            timer: 1000
                                        })
                                    }
                                })
                        }
                    })
            }
        })
    };
    return (
        <div>
            <div className='print:hidden'>
                <div>
                    <div className='flex items-center justify-start'>
                        <Link to={from}>
                            <button className="hidden md:block text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                                Back
                            </button>
                        </Link>
                    </div>
                    <div className='flex items-center justify-center nunito'>
                        <h1 className="nunito text-2xl text-center font-bold px-5 text-pink-300">
                            Voucher - {voucherSl + 1}
                        </h1>
                    </div>
                    <div className='flex items-center justify-center'>
                        <div className='text-lg font-semibold grid grid-cols-2 text-pink-200 min-w-[380px] sm:min-w-[70%]'>
                            <div className=''>
                                <h1>Name: {client.name}</h1>
                                <h1>Address: {client.address}</h1>
                            </div>
                            <div className='flex justify-end'>
                                <div>
                                    <h1>Date: {currentDate}</h1>
                                    <h1>Mobile No: {client.mobile_no}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center sm:justify-center mt-5 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg">
                    <table className="text-pink-200 min-w-[380px] sm:min-w-[70%]">
                        <thead>
                            <tr className="text-pink-300">
                                <th className="border p-2">Product</th>
                                <th className="border p-2">Qty</th>
                                <th className="border p-2">Rate</th>
                                <th className="border p-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products?.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={item.product_name}
                                            onChange={(e) => handleChange(index, 'product_name', e.target.value)}
                                            className="w-full p-1 outline-none"
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <NumericFormat
                                            value={item.quantity}
                                            onChange={(e) => handleChange(index, 'quantity', e.target.value)}
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
                                            onValueChange={(values) => handleChange(index, 'rate', values.floatValue)}
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
                                <td colSpan="2" className="p-2 border"></td>
                                <td className="p-2 border">Total Bill</td>
                                <td className="p-2 border text-right">{totalBill.toFixed(2)}</td>
                            </tr>
                            <tr className="text-right font-semibold">
                                <td colSpan="2" className="p-2 border"></td>
                                <td className="p-2 border">Discount</td>
                                <td className="p-2 border text-right">
                                    <NumericFormat
                                        value={discount}
                                        getInputRef={discount_amount_ref}
                                        onChange={handleDiscountPaidChange}
                                        className='outline-none w-full h-full text-center'
                                        placeholder='Enter discount'
                                        allowNegative={false}
                                        decimalScale={2}
                                        fixedDecimalScale={false}
                                        thousandSeparator={false}
                                    />
                                </td>
                            </tr>
                            <tr className="text-right font-semibold">
                                <td colSpan="2" className="p-2 border"></td>
                                <td className="p-2 border">Paid Amount</td>
                                <td className="p-2 border text-right">
                                    <NumericFormat
                                        value={paid}
                                        getInputRef={paid_amount_ref}
                                        onChange={handleDiscountPaidChange}
                                        className='outline-none w-full h-full text-center'
                                        placeholder='Enter amount'
                                        allowNegative={false}
                                        decimalScale={2}
                                        fixedDecimalScale={false}
                                        thousandSeparator={false}
                                    />
                                </td>
                            </tr>

                            <tr className="text-right font-semibold">
                                <td colSpan="2" ref={status_ref} className="p-2 border text-center">{status}</td>
                                <td className="p-2 border">Due Amount</td>
                                <td className="p-2 border text-right">
                                    {paid || discount ? due.toFixed(2) : totalBill.toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='flex items-center justify-center gap-5 mt-5'>
                    <button onClick={addProduct} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                        + Add Product
                    </button>
                    <button onClick={handleSubmit} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                        Create Voucher
                    </button>
                    <button onClick={handlePrint} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                        Print
                    </button>
                </div>
            </div>
            <div ref={voucherPrintRef} className='nunito w-[550px] hidden print:block'>
                <div className='flex items-center justify-center mt-3 gap-4'>
                    <img className='w-12 h-12' src='https://i.ibb.co/01Zf9m1/logo.png'></img>
                    <div className='text-center text-2xl font-bold'>
                        <h1>BISMILLAH ENTERPRISE</h1>
                        <h1 className='text-sm'>Jokshin Bazar, Lakshmipur</h1>
                    </div>
                </div>
                <div className='flex items-center justify-center'>
                    <div className='text-sm font-semibold grid grid-cols-2 text-black w-full'>
                        <div className=''>
                            <h1>Name: {client.name}</h1>
                            <h1>Address: {client.address}</h1>
                        </div>
                        <div className='flex justify-end'>
                            <div>
                                <h1>Date: {currentDate}</h1>
                                <h1>Mobile No: {client.mobile_no}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-center nunito'>
                    <h1 className="nunito text-xl text-center font-bold px-5 text-black">
                        Voucher - {voucherSl + 1}
                    </h1>
                </div>
                <div className="flex items-center justify-center mt-1 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-md">
                    <table className="text-black w-full">
                        <div className='absolute w-full flex items-center justify-center'>
                            <div className=''>
                                <h1 className='text-7xl font-bold opacity-20'>{status}</h1>
                            </div>
                        </div>
                        <thead>
                            <tr className="text-black">
                                <th className="border p-2">Product</th>
                                <th className="border p-2">Qty</th>
                                <th className="border p-2">Rate</th>
                                <th className="border p-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products?.map((item, index) => (
                                <tr key={index}>
                                    <td className="border p-2">
                                        <input
                                            type="text"
                                            value={item.product_name}
                                            onChange={(e) => handleChange(index, 'product_name', e.target.value)}
                                            className="w-full p-1 "
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <NumericFormat
                                            value={item.quantity}
                                            onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                                            className='outline-none w-full h-full text-center'
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
                                            onValueChange={(values) => handleChange(index, 'rate', values.floatValue)}
                                            className="outline-none w-full h-full text-center"
                                            placeholder="Enter Rate"
                                            allowNegative={false}
                                            decimalScale={2}
                                            fixedDecimalScale={false}
                                            thousandSeparator={false}
                                        />
                                    </td>
                                    <td className="border p-2 text-center">{item.total.toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr className="text-right font-semibold">
                                <td colSpan="2" className="p-2 border"></td>
                                <td className="p-2 border">Total Bill</td>
                                <td className="p-2 border text-center">{totalBill.toFixed(2)}</td>
                            </tr>
                            <tr className="text-right font-semibold">
                                <td colSpan="2" className="p-2 border"></td>
                                <td className="p-2 border">Discount</td>
                                <td className="p-2 border text-right">
                                    <NumericFormat
                                        value={discount}
                                        onChange={handleDiscountPaidChange}
                                        className='outline-none w-full h-full text-center'
                                        placeholder='Enter discount'
                                        allowNegative={false}
                                        decimalScale={2}
                                        fixedDecimalScale={false}
                                        thousandSeparator={false}
                                    />
                                </td>
                            </tr>
                            <tr className="text-right font-semibold">
                                <td colSpan="2" className="p-2 border"></td>
                                <td className="p-2 border">Paid Amount</td>
                                <td className="p-2 border text-right">
                                    <NumericFormat
                                        value={paid}
                                        onChange={handleDiscountPaidChange}
                                        className='outline-none w-full h-full text-center'
                                        placeholder='Enter amount'
                                        allowNegative={false}
                                        decimalScale={2}
                                        fixedDecimalScale={false}
                                        thousandSeparator={false}
                                    />
                                </td>
                            </tr>

                            <tr className="text-right font-semibold">
                                <td colSpan="2" className="p-2 border"></td>
                                <td className="p-2 border">Due Amount</td>
                                <td className="p-2 border text-center">
                                    {due.toFixed(2)}
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

export default NewVoucher;