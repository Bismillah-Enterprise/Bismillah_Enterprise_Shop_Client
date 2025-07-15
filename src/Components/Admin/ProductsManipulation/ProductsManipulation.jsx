import React, { useRef, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProductsManipulation = () => {
    const allProducts = useLoaderData();
    const location = useLocation();
    const from = location?.state?.pathname;
    const [modal, setModal] = useState(false);
    const navigate = useNavigate();


    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete It!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://bismillah-enterprise-server.onrender.com/products/${id}`, {
                    method: 'DELETE'
                }).then(res => res.json())
                navigate(location.pathname);
                Swal.fire({
                    title: "Deleted!",
                    text: "Product Deleted Successfully.",
                    icon: "success"
                }).then(() => {
                    window.location.reload();
                })
            }
        });
    }

    const handleAddProduct = () => {
        const product_name = product_name_ref.current.value;
        const product_quantity = parseFloat(product_quantity_ref.current.value);
        const product_buy_price = parseFloat(product_buy_price_ref.current.value);
        const product_sell_price = parseFloat(product_sell_price_ref.current.value);

        const product = {
            product_name,
            product_quantity,
            product_buy_price,
            product_sell_price
        }

        Swal.fire({
            title: "Are you sure?",
            text: `You Are Adding ${product_name} In The Shop`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I am Sure"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://bismillah-enterprise-server.onrender.com/products`, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(product)
                })
                    .then(res => res.json())
                    .then(productdata => {
                        if (productdata.acknowledged) {
                            setModal(false);
                            navigate(location.pathname)
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Product Added Successfully',
                                showConfirmButton: false,
                                timer: 1000,
                            })
                        }
                    })
            }

        })
    }

    const product_name_ref = useRef();
    const product_quantity_ref = useRef();
    const product_buy_price_ref = useRef();
    const product_sell_price_ref = useRef();
    return (
        <div>
            {/* modal */}
            <div className={`${!modal ? 'hidden' : 'block'}  w-[350px] bg-black shadow-md shadow-pink-200 rounded-2xl absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
                <div className='flex justify-end -top-[10px] -right-[10px] relative'>
                    <MdOutlineCancel onClick={() => { !setRevenueModal(!revenueModal) }} className='text-pink-200 text-3xl cursor-pointer'></MdOutlineCancel>
                </div>
                <div className='mb-4'>
                    <h1 className='text-lg font-semibold text-pink-300 text-center mb-2'>Product Details</h1>
                    <hr className='text-pink-300 w-full' />
                </div>
                <div className='text-pink-200 flex flex-col gap-5 px-4 pt-0 pb-5 items-center h-full w-full'>
                    <div className='mb-4 w-full'>
                        <div className='mt-2'>
                            <h1 className='lg:text-lg font-semibold mb-2'>Product Name</h1>
                            <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 w-full'>
                                <input ref={product_name_ref} type="text" className='outline-none w-full' />
                            </div>
                        </div>
                        <div className='mt-2'>
                            <h1 className='lg:text-lg font-semibold mb-2'>Quantity</h1>

                            <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 w-full'>
                                <NumericFormat
                                    getInputRef={product_quantity_ref}
                                    className="outline-none w-full h-full"
                                    placeholder="Enter Quantity"
                                    allowNegative={false}
                                    decimalScale={2}
                                    fixedDecimalScale={false}
                                    thousandSeparator={false}
                                />
                            </div>
                        </div>
                        <div className='mt-2'>
                            <h1 className='lg:text-lg font-semibold mb-2'>Product Buy Price</h1>

                            <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 w-full'>
                                <NumericFormat
                                    getInputRef={product_buy_price_ref}
                                    className="outline-none w-full h-full"
                                    placeholder="Enter Amount"
                                    allowNegative={false}
                                    decimalScale={2}
                                    fixedDecimalScale={false}
                                    thousandSeparator={false}
                                />
                            </div>
                        </div>
                        <div className='mt-2'>
                            <h1 className='lg:text-lg font-semibold mb-2'>Product Sell Price</h1>

                            <div className='px-3 border-2 rounded-xl h-8 shadow-2xl shadow-pink-300 w-full'>
                                <NumericFormat
                                    getInputRef={product_sell_price_ref}
                                    className="outline-none w-full h-full"
                                    placeholder="Enter Amount"
                                    allowNegative={false}
                                    decimalScale={2}
                                    fixedDecimalScale={false}
                                    thousandSeparator={false}
                                />
                            </div>
                        </div>
                    </div>
                    <button onClick={() => handleAddProduct()} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-lg font-semibold mb-5 lg:mb-0'>Submit</button>
                </div>
            </div>
            {/* End Modal */}
            <div className='flex items-center justify-start'>
                <Link to={from}>
                    <button className="hidden md:block text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                        Back
                    </button>
                </Link>
            </div>
            <h2 className="text-2xl text-pink-300 font-semibold text-center">Shop Products</h2>
            <div className='flex items-center justify-center gap-5 mt-5'>
                <Link onClick={() => { setModal(true) }} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md  lg:text-lg font-semibold'>+ Add A New Product</Link>
            </div>
            <div className="flex items-center sm:justify-center mt-5 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg">
                <table className="text-pink-200 min-w-[380px] sm:min-w-[70%]">
                    <thead>
                        <tr className="text-pink-300">
                            <th className="p-2 border">SL</th>
                            <th className="p-2 border">Product Name</th>
                            <th className="p-2 border">Quantity</th>
                            <th className="p-2 border">Buy Rate</th>
                            <th className="p-2 border">Sell Rate</th>
                            <th className="p-2 border"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {allProducts?.map((product, index) => (
                            <tr key={index}>
                                <td className="p-2 border">{index + 1}</td>
                                <td className="p-2 border">{product.product_name}</td>
                                <td className="p-2 border">{product.product_quantity}</td>
                                <td className="p-2 border">{product.product_buy_price}</td>
                                <td className="p-2 border">{product.product_sell_price}</td>
                                <td onClick={() => { handleDelete(product._id) }} className="p-2 border text-pink-300 underline cursor-pointer">Delete</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductsManipulation;