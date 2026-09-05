import React, { useEffect, useRef, useState } from 'react';
import { MdAdd, MdDeleteOutline, MdOutlineCancel, MdSearch } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const API = 'http://localhost:5000';

const ProductsManipulation = () => {
    const loadedProducts = useLoaderData();
    const [allProducts, setAllProducts] = useState(loadedProducts || []);
    const [modal, setModal] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const from = location?.state?.pathname;

    const productNameRef = useRef();
    const quantityRef = useRef();
    const buyPriceRef = useRef();
    const sellPriceRef = useRef();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/products`);
            const data = await res.json();
            setAllProducts(data);
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Failed to load products',
                background: '#0b1b18',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = allProducts.filter(product =>
        product.product_name?.toLowerCase().includes(search.toLowerCase()) ||
        String(product.product_sell_price).includes(search)
    );

    const closeModal = () => {
        setModal(false);
        if (productNameRef.current) productNameRef.current.value = '';
        if (quantityRef.current) quantityRef.current.value = '';
        if (buyPriceRef.current) buyPriceRef.current.value = '';
        if (sellPriceRef.current) sellPriceRef.current.value = '';
    };

    const handleAddProduct = async () => {
        const product_name = productNameRef.current?.value?.trim();
        const product_quantity = parseFloat(quantityRef.current?.value);
        const product_buy_price = parseFloat(buyPriceRef.current?.value);
        const product_sell_price = parseFloat(sellPriceRef.current?.value);

        if (
            !product_name ||
            isNaN(product_quantity) ||
            isNaN(product_buy_price) ||
            isNaN(product_sell_price)
        ) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete Information',
                text: 'Please fill in all product fields.',
                background: '#0b1b18',
                color: '#fff'
            });
            return;
        }

        if (product_sell_price < product_buy_price) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Price',
                text: 'Sell price cannot be lower than buy price.',
                background: '#0b1b18',
                color: '#fff'
            });
            return;
        }

        const product = {
            product_name,
            product_quantity,
            product_buy_price,
            product_sell_price
        };

        const result = await Swal.fire({
            title: 'Add Product?',
            text: `Add "${product_name}" to your shop?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Add Product',
            cancelButtonText: 'Cancel',
            background: '#0b1b18',
            color: '#fff',
            confirmButtonColor: '#059669',
            cancelButtonColor: '#334155'
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(`${API}/products`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(product)
            });

            const data = await res.json();

            if (data.acknowledged) {
                closeModal();
                await fetchProducts();

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Product Added',
                    showConfirmButton: false,
                    timer: 1200,
                    background: '#0b1b18',
                    color: '#fff'
                });
            }
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Something went wrong',
                background: '#0b1b18',
                color: '#fff'
            });
        }
    };

    const handleDelete = async id => {
        const result = await Swal.fire({
            title: 'Delete Product?',
            text: "This action can't be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            background: '#0b1b18',
            color: '#fff',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#334155'
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(`${API}/products/${id}`, {
                method: 'DELETE'
            });

            const data = await res.json();

            if (data.acknowledged || data.deletedCount) {
                setAllProducts(prev => prev.filter(product => product._id !== id));

                Swal.fire({
                    icon: 'success',
                    title: 'Product Deleted',
                    showConfirmButton: false,
                    timer: 1100,
                    background: '#0b1b18',
                    color: '#fff'
                });
            }
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                background: '#0b1b18',
                color: '#fff'
            });
        }
    };

    return (
        <div className="min-h-full py-5 sm:py-7 text-white overflow-scroll">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-7">
                <div className="flex items-center gap-3">
                    <Link
                        to={from || '/admin'}
                        className="hidden md:flex items-center px-4 py-2 rounded-xl
                        border border-emerald-400/20 bg-white/[0.03]
                        hover:bg-emerald-400/10 hover:border-emerald-400/40
                        text-slate-300 hover:text-emerald-300 transition-all"
                    >
                        ← Back
                    </Link>

                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-emerald-400/70">
                            Inventory
                        </p>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                            Shop Products
                        </h1>
                    </div>
                </div>

                <button
                    onClick={() => setModal(true)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
                    bg-gradient-to-r from-emerald-500 to-cyan-500
                    hover:from-emerald-400 hover:to-cyan-400
                    text-white font-semibold shadow-lg shadow-emerald-500/20
                    transition-all duration-300 hover:-translate-y-0.5"
                >
                    <MdAdd className="text-xl" />
                    Add Product
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                <div className="rounded-2xl border border-emerald-400/10 bg-white/[0.035] p-4">
                    <p className="text-xs text-slate-400">Total Products</p>
                    <p className="text-2xl font-bold text-emerald-300 mt-1">
                        {allProducts.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-cyan-400/10 bg-white/[0.035] p-4">
                    <p className="text-xs text-slate-400">Visible Products</p>
                    <p className="text-2xl font-bold text-cyan-300 mt-1">
                        {filteredProducts.length}
                    </p>
                </div>

                <div className="hidden lg:block rounded-2xl border border-violet-400/10 bg-white/[0.035] p-4">
                    <p className="text-xs text-slate-400">Inventory Quantity</p>
                    <p className="text-2xl font-bold text-violet-300 mt-1">
                        {allProducts.reduce(
                            (sum, product) => sum + Number(product.product_quantity || 0),
                            0
                        )}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center max-w-xl mb-6 px-4 py-2 rounded-2xl
                border border-emerald-400/20 bg-white/[0.035]
                focus-within:border-emerald-400/50 focus-within:shadow-lg
                focus-within:shadow-emerald-500/10 transition-all"
            >
                <MdSearch className="text-emerald-300 text-2xl mr-2" />

                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500 py-1"
                    placeholder="Search product name or sell price..."
                />

                {search && (
                    <MdOutlineCancel
                        onClick={() => setSearch('')}
                        className="text-slate-400 hover:text-white text-xl cursor-pointer"
                    />
                )}
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.025]
                overflow-hidden shadow-2xl shadow-black/20"
            >
                <div className="overflow-x-auto scrollbar-hide p-5">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="bg-emerald-400/[0.06] border-b border-white/10">
                                {['SL', 'Product Name', 'Quantity', 'Buy Rate', 'Sell Rate', 'Action'].map(
                                    heading => (
                                        <th
                                            key={heading}
                                            className="px-4 py-4 text-left text-xs uppercase tracking-wider text-emerald-300/80 font-semibold"
                                        >
                                            {heading}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-14 text-center text-slate-400">
                                        Loading products...
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-14 text-center">
                                        <p className="text-slate-400">No products found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product, index) => (
                                    <tr
                                        key={product._id || index}
                                        className="border-b border-white/[0.06] last:border-0
                                        hover:bg-emerald-400/[0.035] transition-colors"
                                    >
                                        <td className="px-4 py-4 text-slate-500">
                                            {index + 1}
                                        </td>

                                        <td className="px-4 py-4 font-medium text-white">
                                            {product.product_name}
                                        </td>

                                        <td className="px-4 py-4 text-slate-300">
                                            {product.product_quantity}
                                        </td>

                                        <td className="px-4 py-4 text-cyan-300">
                                            ৳ {product.product_buy_price}
                                        </td>

                                        <td className="px-4 py-4 text-emerald-300 font-medium">
                                            ৳ {product.product_sell_price}
                                        </td>

                                        <td className="px-4 py-4">
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5
                                                rounded-lg border border-red-400/20
                                                bg-red-400/5 text-red-300
                                                hover:bg-red-400/10 hover:border-red-400/40
                                                transition-all"
                                            >
                                                <MdDeleteOutline />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        onClick={closeModal}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    <div className="relative w-full max-w-md rounded-3xl border border-emerald-400/20
                        bg-[#0b1b18] shadow-2xl shadow-emerald-500/10 overflow-hidden"
                    >
                        <div className="h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400" />

                        <div className="flex items-center justify-between p-5 border-b border-white/10">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-emerald-400/70">
                                    Inventory
                                </p>
                                <h2 className="text-xl font-bold">Add New Product</h2>
                            </div>

                            <button
                                onClick={closeModal}
                                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
                            >
                                <MdOutlineCancel className="text-2xl" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div>
                                <label className="text-sm text-slate-400">Product Name</label>
                                <input
                                    ref={productNameRef}
                                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/[0.04]
                                    border border-white/10 outline-none
                                    focus:border-emerald-400/50 transition"
                                    placeholder="Enter product name"
                                />
                            </div>

                            {[
                                ['Quantity', quantityRef, 'Enter quantity'],
                                ['Buy Price', buyPriceRef, 'Enter buy price'],
                                ['Sell Price', sellPriceRef, 'Enter sell price']
                            ].map(([label, ref, placeholder]) => (
                                <div key={label}>
                                    <label className="text-sm text-slate-400">{label}</label>
                                    <div className="mt-1 px-4 py-2.5 rounded-xl bg-white/[0.04]
                                        border border-white/10 focus-within:border-emerald-400/50"
                                    >
                                        <NumericFormat
                                            getInputRef={ref}
                                            className="w-full bg-transparent outline-none"
                                            placeholder={placeholder}
                                            allowNegative={false}
                                            decimalScale={2}
                                            thousandSeparator={false}
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={handleAddProduct}
                                className="w-full mt-2 py-2.5 rounded-xl font-semibold
                                bg-gradient-to-r from-emerald-500 to-cyan-500
                                hover:from-emerald-400 hover:to-cyan-400
                                shadow-lg shadow-emerald-500/20 transition-all"
                            >
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsManipulation;