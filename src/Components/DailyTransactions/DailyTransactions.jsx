import React, { useEffect, useRef, useState } from 'react';
import { NumberFormatBase } from 'react-number-format';
import { data, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loading from '../Shared/Loading/Loading';
import { MdOutlineCancel } from 'react-icons/md';
import { PuffLoader } from 'react-spinners';

const DailyTransactions = () => {
    const [tab, setTab] = useState('revenue');
    const [reload, setReload] = useState(false);
    const [computer, setComputer] = useState(0);
    const [stationary, setStationary] = useState(0);
    const [photocopy, setPhotocopy] = useState(0);
    const [others, setOthers] = useState(0);
    const [rvAmount, setRvAmount] = useState('');
    const [exAmount, setExAmount] = useState('');
    const [expenses, setExpenses] = useState(0);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allData, setAllData] = useState([]);
    const [details, setDetails] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [rvCategory, setRvCategory] = useState('');
    const [deleteItem, setDeleteItem] = useState('');

    const now = new Date();
    const currentDate = now.toLocaleDateString('en-BD', {
        day: 'numeric',
        year: 'numeric',
        month: 'long',
    });

    useEffect(() => {
        fetch(`https://bismillah-enterprise-server.onrender.com/daily_transactions`).then(res => res.json()).then((data) => {
            setComputer(data?.computer_revenues);
            setStationary(data?.stationary_revenues);
            setPhotocopy(data?.photocopy_revenues);
            setOthers(data?.others_revenues?.reduce((sum, item) => sum + item.amount, 0));
            setExpenses(data?.expenses?.reduce((sum, item) => sum + item.amount, 0));
            setAllData(data);
        })
    }, [reload])


    const handleRevenueTransections = async () => {
        setLoading(true)
        const revenue_amount = rvAmount;
        const revenue_category = revenueCategoryRef.current.value;
        const revenue_comment = revenueCommentRef.current.value;

        if (!revenue_amount || !revenue_category || (rvCategory === 'Others' && !revenue_comment)) {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: "You Missd a Field",
                showConfirmButton: false,
                timer: 1000
            })
            setLoading(false)
            return;
        } else {
            fetch(`https://bismillah-enterprise-server.onrender.com/daily_transactions`).then(res => res.json()).then((data) => {
                const gottedDate = data?.date;
                if (gottedDate !== currentDate) {
                    if (computer === 0 && stationary === 0 && photocopy === 0 && others === 0 && expenses === 0) {
                        const trData = { date: currentDate, amount: revenue_amount * 1, category: revenue_category, comment: revenue_comment }
                        fetch(`https://bismillah-enterprise-server.onrender.com/daily_revenue_transactions`, {
                            method: 'PATCH',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify(trData)
                        }).then(res => res.json()).then(data => {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Transaction Added SuccessFully",
                                showConfirmButton: false,
                                timer: 1000
                            })
                            setRvAmount('');
                            revenueCategoryRef.current.value = '';
                            revenueCommentRef.current.value = '';
                            setLoading(false)
                            setReload(!reload);
                        })
                    } else {
                        const transaction_summary = { update_info: { update_date: currentDate, amount: revenue_amount * 1, category: revenue_category, comment: revenue_comment }, category: revenue_category, date: gottedDate, computer_revenues: data?.computer_revenues, stationary_revenues: data?.stationary_revenues, photocopy_revenues: data?.photocopy_revenues, others_revenues: { amounts: data?.others_revenues?.map(item => item.amount) || [], descriptions: data?.others_revenues?.map(item => item.comment) || [] }, expenses: { amounts: data?.expenses?.map(item => item.amount) || [], descriptions: data?.expenses?.map(item => item.comment) || [] } }
                        fetch(`https://bismillah-enterprise-server.onrender.com/reset_daily_transactions`, {
                            method: 'PATCH',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify(transaction_summary)
                        }).then(res => res.json()).then(data => {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Transaction Added SuccessFully",
                                showConfirmButton: false,
                                timer: 1000
                            })
                            setRvAmount('');
                            revenueCategoryRef.current.value = '';
                            revenueCommentRef.current.value = '';
                            setLoading(false)
                            setReload(!reload);
                        })
                    }

                } else {
                    const trData = { date: currentDate, amount: revenue_amount * 1, category: revenue_category, comment: revenue_comment }
                    fetch(`https://bismillah-enterprise-server.onrender.com/daily_revenue_transactions`, {
                        method: 'PATCH',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify(trData)
                    }).then(res => res.json()).then(data => {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Transaction Added SuccessFully",
                            showConfirmButton: false,
                            timer: 1000
                        })
                        setRvAmount('');
                        revenueCategoryRef.current.value = '';
                        revenueCommentRef.current.value = '';
                        setLoading(false)
                        setReload(!reload);
                    })
                }
            })

        }
    }
    const handleExpenseTransections = async () => {
        setLoading(true)
        const expense_amount = exAmount;
        const expense_comment = expenseCommentRef.current.value;
        if (!expense_amount || !expense_comment) {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: "You Missd a Field",
                showConfirmButton: false,
                timer: 1000
            })
            setLoading(false)
            return;
        } else {
            fetch(`https://bismillah-enterprise-server.onrender.com/daily_transactions`).then(res => res.json()).then((data) => {
                const gottedDate = data?.date;
                if (gottedDate !== currentDate) {
                    if (computer === 0 && stationary === 0 && photocopy === 0 && others === 0 && expenses === 0) {
                        const trData = { date: currentDate, amount: expense_amount * 1, comment: expense_comment }
                        fetch(`https://bismillah-enterprise-server.onrender.com/daily_expense_transactions`, {
                            method: 'PATCH',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify(trData)
                        }).then(res => res.json()).then(data => {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Transaction Added SuccessFully",
                                showConfirmButton: false,
                                timer: 1000
                            })
                            setExAmount('');
                            expenseCommentRef.current.value = '';
                            setLoading(false)
                            setReload(!reload);
                        })
                    } else {
                        const expense_summary = { update_info: { update_date: currentDate, amount: expense_amount * 1, comment: expense_comment }, category: 'Expense', date: gottedDate, computer_revenues: data?.computer_revenues, stationary_revenues: data?.stationary_revenues, photocopy_revenues: data?.photocopy_revenues, others_revenues: { amounts: data?.others_revenues?.map(item => item.amount) || [], descriptions: data?.others_revenues?.map(item => item.comment) || [] }, expenses: { amounts: data?.expenses?.map(item => item.amount) || [], descriptions: data?.expenses?.map(item => item.comment) || [] } }
                        fetch(`https://bismillah-enterprise-server.onrender.com/reset_daily_transactions`, {
                            method: 'PATCH',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify(expense_summary)
                        }).then(res => res.json()).then(data => {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Transaction Added SuccessFully",
                                showConfirmButton: false,
                                timer: 1000
                            })
                            setExAmount('');
                            expenseCommentRef.current.value = '';
                            setLoading(false)
                            setReload(!reload);
                        })
                    }

                } else {
                    const trData = { date: currentDate, amount: expense_amount * 1, comment: expense_comment }
                    fetch(`https://bismillah-enterprise-server.onrender.com/daily_expense_transactions`, {
                        method: 'PATCH',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify(trData)
                    }).then(res => res.json()).then(data => {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Transaction Added SuccessFully",
                            showConfirmButton: false,
                            timer: 1000
                        })
                        setExAmount('');
                        expenseCommentRef.current.value = '';
                        setLoading(false)
                        setReload(!reload);
                    })
                }
            })
        }
    }
    const handleDelete = (index, item) => {
        setModalLoading(true)
        const oldEx = [...allData?.expenses];
        const oldOthers = [...allData?.others_revenues];
        item === 'expenses' ? oldEx.splice(index, 1) : oldOthers.splice(index, 1);
        const updateData = { category: item, update: item === 'expenses' ? oldEx : oldOthers }
        console.log(updateData);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {

            if (result.isConfirmed) {

                fetch('https://bismillah-enterprise-server.onrender.com/update_expenses', {
                    method: "PATCH",
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                })
                    .then(res => res.json())
                    .then(() => {

                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Deleted Successfully",
                            showConfirmButton: false,
                            timer: 1000
                        });

                        setModalLoading(false);
                        setReload(!reload);
                        setDetails(item === 'expenses' ? oldEx : oldOthers);
                    });
            } else {
                setModalLoading(false);
            }
        });
    }

    const revenueCategoryRef = useRef();
    const expenseCommentRef = useRef();
    const revenueCommentRef = useRef();
    return (
        <div className='h-full relative'>
            < div className={`${!modal ? 'hidden' : 'block'} h-fit w-full lg:w-[500px] bg-black shadow-md shadow-pink-200 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50`
            }>
                {
                    modalLoading ? <div className='h-full w-full flex items-center justify-center rounded-2xl overflow-hidden'><Loading></Loading></div> :
                        <div className='pb-5'>
                            <div className='flex justify-end -top-[10px] -right-[10px] relative'>
                                <MdOutlineCancel onClick={() => { !setModal(!modal) }} className='text-pink-200 text-3xl cursor-pointer'></MdOutlineCancel>
                            </div>
                            <div className='h-[300px] overflow-scroll scrollbar-hide text-pink-200 flex flex-col gap-5 p-5 items-center w-full'>
                                <h1 className='text-xl font-semibold text-center'>{currentDate}</h1>
                                <h1 className='text-lg font-semibold text-center'>{deleteItem}</h1>
                                <table className="text-pink-200 sm:min-w-[80%]">
                                    <thead>
                                        <tr className="text-pink-300">
                                            <th className="p-2 border">Sl</th>
                                            <th className="p-2 border">Description</th>
                                            <th className="p-2 border">Amount</th>
                                            <th className="p-2 border"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {details?.map((item, index) => (
                                            <tr key={index}>
                                                <td className="p-2 border">{index + 1}</td>
                                                <td className="p-2 border">{item?.comment}</td>
                                                <td className="p-2 border">{item?.amount}</td>
                                                <td onClick={() => { handleDelete(index, deleteItem) }} className="p-2 border cursor-pointer">-</td>
                                            </tr>
                                        ))}

                                    </tbody>
                                    <thead>
                                        <tr className="text-pink-300">
                                            <th className="p-2 border"></th>
                                            <th className="p-2 border">Total</th>
                                            <th className="p-2 border">{details?.reduce((sum, item) => sum + item.amount, 0)}</th>
                                            <th className="p-2 border"></th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                }

            </div >
            <h1 className='text-xl md:text-3xl font-bold text-center text-pink-200'>Daily Transactions</h1>
            <div className='flex items-center gap-10 justify-center mt-8'>
                <Link to={'/'} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-2 md:px-5 py-1 rounded-md text-xs lg:text-lg font-semibold">
                    Back
                </Link>
                <button onClick={() => { setTab('revenue') }} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-2 md:px-5 py-1 rounded-md text-xs lg:text-lg font-semibold">
                    Revenues
                </button>
                <button onClick={() => { setTab('expense') }} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-2 md:px-5 py-1 rounded-md text-xs lg:text-lg font-semibold">
                    Expenses
                </button>
            </div>

            <div className={`${tab === 'revenue' ? '' : 'hidden'} text-pink-200 mt-5 md:mt-[100px] w-full flex flex-col items-center justify-center px-5`}>
                <h1 className='text-center mt-3 font-semibold text-lg md:text-2xl mb-2'>Date: {currentDate}</h1>
                <h1 className='text-center font-semibold text-md md:text-xl mb-5'>Computer: <span className='text-green-500'>{computer} Taka</span> , Stationary: <span className='text-green-500'>{stationary} Taka</span>, Photocopy: <span className='text-green-500'>{photocopy} Taka</span>, Others: <span onClick={() => { setDetails(allData?.others_revenues); setDeleteItem('others_revenues'); setModal(!modal) }} className='text-green-500 cursor-pointer underline'>{others} Taka</span></h1>
                <div className='max-w-full min-w-full md:min-w-[400px] h-fit border-2 rounded-2xl'>
                    <h1 className='text-center mt-3 font-semibold text-lg md:text-2xl'>Revenues</h1>
                    <div className={`${loading ? 'flex' : 'hidden'} w-full h-full items-center justify-center`}>
                        <PuffLoader color='#fccee8' />
                    </div>
                    <div className={`text-pink-200 ${loading ? 'hidden' : 'flex'} flex-col gap-5 p-8 pt-0 items-start h-full w-full`}>
                        <div className='mb-4 w-full'>
                            <div className='mt-2'>
                                <h1 className='lg:text-lg font-semibold mb-2'>Transection Amount</h1>
                                <div className='px-3 border-2 rounded-xl h-12 shadow-2xl shadow-pink-300 w-full'>
                                    <NumberFormatBase
                                        value={rvAmount}
                                        onValueChange={(values) => {
                                            setRvAmount(values.value);
                                        }}
                                        className='outline-none w-full h-full'
                                        placeholder='Enter amount'
                                        thousandSeparator={true}
                                        allowNegative={false}
                                        isNumericString={true}
                                    />
                                </div>
                            </div>
                            <div className='mt-2'>
                                <h1 className='lg:text-lg font-semibold mb-2'>Category</h1>
                                <div className=' border-2 rounded-xl h-12 shadow-2xl shadow-pink-300 w-full flex'>
                                    <select onChange={(e) => { setRvCategory(e.target.value) }} ref={revenueCategoryRef} name="staff_category" id="staff_category" className='outline-none w-full bg-[#3A454A] rounded-xl px-3'>
                                        <option value=""></option>
                                        <option value="Computer" className=''>Computer</option>
                                        <option value="Stationary">Stationary</option>
                                        <option value="Photocopy">Photocopy</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                            </div>
                            <div className={`${rvCategory === 'Others' ? 'mt-2' : 'hidden'}`}>
                                <h1 className='lg:text-lg font-semibold mb-2'>Comment</h1>
                                <div className='px-3 border-2 rounded-xl h-12 shadow-2xl shadow-pink-300 w-full flex'>
                                    <input ref={revenueCommentRef} type="text" className='outline-none w-full' />
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-center'>
                            <button onClick={() => handleRevenueTransections()} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md md:text-lg font-semibold mb-5 lg:mb-0'>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${tab === 'expense' ? '' : 'hidden'} text-pink-200 mt-5 md:mt-[100px] w-full flex flex-col items-center justify-center px-5`}>
                <h1 className='text-center mt-3 font-semibold text-lg md:text-2xl mb-2'>Date: {currentDate}</h1>
                <h1 className='text-center font-semibold md:text-xl mb-5'>Total Expense: <span onClick={() => { setDetails(allData?.expenses); setDeleteItem('expenses'); setModal(!modal) }} className='text-red-500 cursor-pointer underline'>{expenses} Taka</span></h1>
                <div className='max-w-full min-w-full md:min-w-[400px] h-fit border-2 rounded-2xl'>
                    <h1 className='text-center mt-3 font-semibold text-lg md:text-2xl'>Expenses</h1>
                    <div className={`${loading ? 'flex' : 'hidden'} w-full h-full items-center justify-center`}>
                        <PuffLoader color='#fccee8' />
                    </div>
                    <div className={`text-pink-200 ${loading ? 'hidden' : 'flex'} flex-col gap-5 p-8 pt-0 items-start h-full w-full`}>
                        <div className='mb-4 w-full'>
                            <div className='mt-2'>
                                <h1 className='lg:text-lg font-semibold mb-2'>Transection Amount</h1>
                                <div className='px-3 border-2 rounded-xl h-12 shadow-2xl shadow-pink-300 w-full'>
                                    <NumberFormatBase
                                        value={exAmount}
                                        onValueChange={(values) => {
                                            setExAmount(values.value);
                                        }}
                                        className='outline-none w-full h-full'
                                        placeholder='Enter amount'
                                        thousandSeparator={true}
                                        allowNegative={false}
                                        isNumericString={true}
                                    />
                                </div>
                            </div>
                            <div className='mt-2'>
                                <h1 className='lg:text-lg font-semibold mb-2'>Comment</h1>
                                <div className='px-3 border-2 rounded-xl h-12 shadow-2xl shadow-pink-300 w-full flex'>
                                    <input ref={expenseCommentRef} type="text" className='outline-none w-full' />
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-center'>
                            <button onClick={() => handleExpenseTransections()} className='text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md md:text-lg font-semibold mb-5 lg:mb-0'>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyTransactions;