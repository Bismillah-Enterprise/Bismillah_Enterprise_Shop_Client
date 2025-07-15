import React, { useEffect, useState } from 'react';
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
    const totalBill = products.reduce((sum, item) => sum + item.total, 0);

    // Handle input change for each field
    const handleChange = (index, field, value) => {
        const newProducts = [...products];
        newProducts[index][field] = value;

        // auto-calculate total
        const quantity = parseFloat(newProducts[index].quantity || 0);
        const rate = parseFloat(newProducts[index].rate || 0);
        newProducts[index].total = quantity * rate;

        setProducts(newProducts);
    };

    // Add new product row
    const addProduct = () => {
        setProducts([...products, { product_name: '', quantity: '', rate: '', total: 0 }]);
    };
    // Send all product data to your backend
    const handleSubmit = async () => {
        const newSlNo = voucherSl + 1;
        const voucher = {
            date: `${currentDate}, ${Time}`,
            voucher_no: newSlNo,
            products,
            total: totalBill,
            paid_amount: 0,
            due_amount: totalBill,
            payment_status: 'Due'
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
                fetch(`https://bismillah-enterprise-server.onrender.com/new_voucher/${client._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(voucher)
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.acknowledged) {
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
                    </tbody>
                </table>
            </div>
            <div className='flex items-center justify-center gap-5 flex-col mt-5'>
                <button onClick={addProduct} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                    + Add Product
                </button>
                <button onClick={handleSubmit} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                    Create Voucher
                </button>
            </div>
        </div>
    );
};

export default NewVoucher;