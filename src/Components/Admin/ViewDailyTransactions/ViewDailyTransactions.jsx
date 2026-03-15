import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import VoucherHeading from '../../Shared/VoucherHeading/VoucherHeading';
import Loading from '../../Shared/Loading/Loading';

const ViewDailyTransactions = () => {
    const [loadedTransactions, setLoadedTransactions] = useState([]);
    const [allTRX, setAllTRX] = useState([]);
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allEx, setAllEx] = useState([]);
    const [reload, setReload] = useState(false);
    const [expenses, setExpenses] = useState(0);
    const [details, setDetails] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        fetch(`https://bismillah-enterprise-server.onrender.com/daily_transactions`).then(res => res.json()).then((data) => {
            setLoadedTransactions(data);
            setAllTRX(data?.summary);
            setExpenses(data?.expenses?.reduce((sum, item) => sum + item.amount, 0));
            setAllEx(data?.expenses)
            setAllTRX(data?.summary);
        })
    }, [reload])
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-BD', {
        day: 'numeric',
        year: 'numeric',
        month: 'long',
    });

    const formatDate = (value) => {
        const date = new Date(value);
        return new Intl.DateTimeFormat('en-US', {
            day: 'numeric',
            year: 'numeric',
            month: 'long',
        }).format(date);
    };
    const handleDateChange = (e, category) => {
        const currentDate = new Date();
        const gottedDate = new Date(e);
        const rawValue = e;        // 2026-01-22
        const formatted = formatDate(rawValue); // January 22, 2026
        if (category === 'start') {
            setSelectedStartDate(formatted);
            const sortedData = loadedTransactions?.summary?.filter(rvn => {
                return new Date(rvn?.date) >= new Date(formatted)
            });
            setAllTRX(sortedData);
        }
        else if (category === 'end') {
            if (gottedDate < new Date(selectedStartDate)) {
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "End Date Can't be less than Start Date",
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    return;
                })
            }
            else if (!selectedStartDate) {
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "At First Select Start Date",
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    return;
                })
            }
            else {
                setSelectedEndDate(formatted);
                const sortedData = loadedTransactions?.summary?.filter(rvn => { return new Date(rvn?.date) >= new Date(selectedStartDate) && new Date(rvn?.date) <= new Date(formatted) });
                setAllTRX(sortedData);
            }
        }
    };

    const handleClose = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Close it!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://bismillah-enterprise-server.onrender.com/daily_transactions`).then(res => res.json()).then((data) => {
                    const gottedDate = data?.date;
                    const expense_descriptions = data?.expenses.map(item => item?.comment) || [];
                    const expenses = data?.expenses?.reduce((sum, item) => sum + item.amount, 0) || 0;
                    // const expense_summary = { date: gottedDate, computer_revenues: data?.computer_revenues, stationary_revenues: data?.stationary_revenues, photocopy_revenues: data?.photocopy_revenues, others_revenues: data?.others_revenues, expenses, expense_descriptions }
                    const expense_summary = { date: gottedDate, computer_revenues: data?.computer_revenues, stationary_revenues: data?.stationary_revenues, photocopy_revenues: data?.photocopy_revenues, others_revenues: { amounts: data?.others_revenues?.map(item => item.amount) || [], descriptions: data?.others_revenues?.map(item => item.comment) || [] }, expenses: { amounts: data?.expenses?.map(item => item.amount) || [], descriptions: data?.expenses?.map(item => item.comment) || [] } }
                    fetch(`https://bismillah-enterprise-server.onrender.com/close_daily_transactions`, {
                        method: 'PATCH',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify(expense_summary)
                    }).then(res => res.json()).then(data => {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Transactions Closed SuccessFully",
                            showConfirmButton: false,
                            timer: 1000
                        })
                        expenseCommentRef.current.value = '';
                        setReload(!reload);
                    })
                })
            }
        });
    }

    const handleDelete = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const filtered = loadedTransactions?.summary?.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate < start || itemDate > end;
        });
        Swal.fire({
            title: "Are you sure?",
            text: `Delete Data From ${startDate} To ${endDate}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete Data!"
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                fetch("https://bismillah-enterprise-server.onrender.com/delete_summary", {
                    method: "PATCH",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        startDate,
                        endDate
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Transactions Deleted SuccessFully",
                            showConfirmButton: false,
                            timer: 1000
                        }).then(() => {
                            setLoading(false);
                            setReload(!reload);
                            // setAllTRX(filtered);
                            setSelectedStartDate('');
                            setSelectedEndDate('')
                            // navigate(0);
                        })
                    });
            }
        })
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
            @page { size: A4; margin: 5mm; }
            body { font-family: sans-serif; color: black; display: flex; justify-content: end; width: 100% }
            .voucher-wrapper {
            width: 100%;
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
    const voucherPrintRef = useRef();
    const todayCash = loadedTransactions?.others_revenues?.reduce((sum, item) => sum + item?.amount, 0) + loadedTransactions?.photocopy_revenues + loadedTransactions?.stationary_revenues + loadedTransactions?.computer_revenues - loadedTransactions?.expenses?.reduce((sum, item) => sum + item?.amount, 0);
    const organizedData = allTRX?.sort((a, b) => new Date(b.date) - new Date(a.date));


    const totalComputer =
        (allTRX?.reduce((sum, item) => sum + (item?.computer_revenues || 0), 0) || 0) +
        (loadedTransactions?.computer_revenues || 0);

    const totalStationary =
        (allTRX?.reduce((sum, item) => sum + (item?.stationary_revenues || 0), 0) || 0) +
        (loadedTransactions?.stationary_revenues || 0);

    const totalPhotocopy =
        (allTRX?.reduce((sum, item) => sum + (item?.photocopy_revenues || 0), 0) || 0) +
        (loadedTransactions?.photocopy_revenues || 0);

    const totalOthers =
        (allTRX?.reduce(
            (sum, item) =>
                sum +
                ((item?.others_revenues?.amounts || []).reduce((s, i) => s + i, 0)),
            0
        ) || 0) +
        ((loadedTransactions?.others_revenues || []).reduce((sum, i) => sum + (i?.amount || 0), 0));

    const totalExpenses =
        (allTRX?.reduce(
            (sum, item) =>
                sum +
                ((item?.expenses?.amounts || []).reduce((s, i) => s + i, 0)),
            0
        ) || 0) +
        ((loadedTransactions?.expenses || []).reduce((sum, i) => sum + (i?.amount || 0), 0));

    const totalCash =
        totalComputer +
        totalStationary +
        totalPhotocopy +
        totalOthers -
        totalExpenses;
    return (
        <div className='h-full relative'>
            <h2 className="text-lg md:text-2xl text-pink-300 font-semibold text-center">View Daily Transactions</h2>

            < div className={`${!modal ? 'hidden' : 'block'} h-fit w-full lg:w-[500px] bg-black shadow-md shadow-pink-200 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50`
            }>
                {
                    loading ? <div className='h-full w-full flex items-center justify-center rounded-2xl overflow-hidden'><Loading></Loading></div> :
                        <div className=''>
                            <div className='flex justify-end -top-[10px] -right-[10px] relative'>
                                <MdOutlineCancel onClick={() => { !setModal(!modal) }} className='text-pink-200 text-3xl cursor-pointer'></MdOutlineCancel>
                            </div>
                            <div className='h-[300px] overflow-scroll scrollbar-hide text-pink-200 flex flex-col gap-5 p-5 items-center w-full'>
                                <h1 id='modal_date' className='text-xl font-semibold text-center'></h1>
                                <table className="text-pink-200 sm:min-w-[80%]">
                                    <thead>
                                        <tr className="text-pink-300">
                                            <th className="p-2 border">Sl</th>
                                            <th className="p-2 border">Description</th>
                                            <th className="p-2 border">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {details?.map((item, index) => (
                                            <tr key={index}>
                                                <td className="p-2 border">{index + 1}</td>
                                                <td className="p-2 border">{item?.comment}</td>
                                                <td className="p-2 border">{item?.amount}</td>
                                            </tr>
                                        ))}

                                    </tbody>
                                    <thead>
                                        <tr className="text-pink-300">
                                            <th className="p-2 border"></th>
                                            <th className="p-2 border">Total</th>
                                            <th className="p-2 border">{details?.reduce((sum, item) => sum + item.amount, 0)}</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                }

            </div >

            <div className='flex items-center justify-center w-full'>
                <div className='xl:flex justify-center items-end gap-8 text-pink-200 w-full sm:w-[80%]'>
                    <div className='text-sm xl:text-md flex flex-col xl:flex-row items-center justify-between xl:gap-14 flex-1'>
                        <div className='flex xl:flex-col items-center xl:items-start w-full gap-2 mt-4'>
                            <p className='text-nowrap w-25'>Show From</p>
                            <div className="relative inline-block px-3 border-2 border-pink-200 rounded-xl h-10 shadow-md shadow-pink-200 w-full">
                                {/* Native input – visually hidden but focusable */}
                                <input
                                    type="date"
                                    onChange={(e) => { handleDateChange(e.target.value, 'start') }}
                                    className="loan-date opacity-0 z-20 absolute"
                                />
                                <h1 className='absolute top-1/2 xl:left-1/2 transform xl:-translate-x-1/2 -translate-y-1/2 z-10 text-center'>{selectedStartDate ? selectedStartDate : 'Select Date'}</h1>
                                <Link onClick={(e) => { handleDateChange(new Date(), 'start') }} className='absolute top-1/2 right-2 transform -translate-y-1/2 z-20 text-center border-2 border-pink-200 px-4 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:bg-pink-200 text-pink-200 hover:text-black'>Today Date</Link>
                            </div>
                        </div>
                        <div className='flex xl:flex-col items-center xl:items-start w-full gap-2 mt-4'>
                            <p className='text-pink-200 text-nowrap w-25'>Show To</p>
                            <div className="relative inline-block px-3 border-2 border-pink-200 rounded-xl h-10 shadow-md shadow-pink-200 w-full">
                                {/* Native input – visually hidden but focusable */}
                                <input
                                    type="date"
                                    onChange={(e) => { handleDateChange(e.target.value, 'end') }}
                                    className="loan-date opacity-0 z-20 absolute"
                                />
                                <h1 className='absolute top-1/2 xl:left-1/2 transform xl:-translate-x-1/2 -translate-y-1/2 z-10 text-center'>{selectedEndDate ? selectedEndDate : 'Select Date'}</h1>
                                <Link onClick={() => { setAllTRX(loadedTransactions?.summary); setSelectedStartDate(""); setSelectedEndDate(""); }} className='xl:hidden absolute top-1/2 right-2 transform -translate-y-1/2 z-20 text-center border-2 border-pink-200 px-4 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:bg-pink-200 text-pink-200 hover:text-black'>Clear Date</Link>
                            </div>
                        </div>
                    </div>
                    <div className='mb-2 hidden xl:block '>
                        <Link onClick={() => { setAllTRX(loadedTransactions?.summary); setSelectedStartDate(""); setSelectedEndDate(""); }} className='w-80 text-center border-2 border-pink-200 px-4 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:bg-pink-200 text-pink-200 hover:text-black'>Clear Filter</Link>
                    </div>
                </div>
            </div>


            {
                loading ? <div className='my-10 w-full flex items-center justify-center'><div className='w-[80%] rounded-2xl overflow-hidden'><Loading></Loading></div></div> :
                    <div className="flex items-center sm:justify-center mt-5 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg pb-10">
                        <table className="text-pink-200 sm:min-w-[80%]">
                            <thead>
                                <tr className="text-pink-300">
                                    <th className="p-2 border">Date</th>
                                    <th className="p-2 border">Computer</th>
                                    <th className="p-2 border">Stationary</th>
                                    <th className="p-2 border">Photocopy</th>
                                    <th className="p-2 border">Others</th>
                                    <th className="p-2 border">Expenses</th>
                                    <th className="p-2 border">Cash</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={`${(loadedTransactions?.computer_revenues === 0 && loadedTransactions?.stationary_revenues === 0 && loadedTransactions?.photocopy_revenues === 0 && loadedTransactions?.others_revenues === 0 && loadedTransactions?.expenses?.reduce((sum, item) => sum + item?.amount, 0) === 0) ? 'hidden' : ''}`}>
                                    <td className="p-2 border flex gap-5 items-center justify-center"><span className='text-green-500'>{loadedTransactions?.date}</span> <span onClick={handleClose} className={`disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-1 py-1 rounded-md text-xs font-semibold`}>
                                        Close
                                    </span></td>
                                    <td className="p-2 border text-green-500">{loadedTransactions?.computer_revenues}</td>
                                    <td className="p-2 border text-green-500">{loadedTransactions?.stationary_revenues}</td>
                                    <td className="p-2 border text-green-500">{loadedTransactions?.photocopy_revenues}</td>
                                    <td onClick={() => { document.getElementById('modal_date').innerText = loadedTransactions?.date; setDetails(loadedTransactions?.others_revenues); setModal(!modal); }} className="p-2 border cursor-pointer text-green-500 underline">{loadedTransactions?.others_revenues?.reduce((sum, item) => sum + item?.amount, 0)}</td>
                                    <td onClick={() => { document.getElementById('modal_date').innerText = loadedTransactions?.date; setDetails(loadedTransactions?.expenses); setModal(!modal); }} className="p-2 border cursor-pointer text-red-500 underline">{loadedTransactions?.expenses?.reduce((sum, item) => sum + item?.amount, 0)}</td>
                                    <td className={`p-2 border font-bold ${todayCash < 0 ? 'text-red-500' : 'text-green-500'}`}>{todayCash}</td>
                                </tr>
                                {allTRX?.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, index) => {

                                    const others =
                                        (item?.others_revenues?.amounts || []).reduce((sum, i) => sum + i, 0);

                                    const expenses =
                                        (item?.expenses?.amounts || []).reduce((sum, i) => sum + i, 0);

                                    const cash =
                                        (item?.computer_revenues || 0) +
                                        (item?.stationary_revenues || 0) +
                                        (item?.photocopy_revenues || 0) +
                                        others -
                                        expenses;

                                    const getExpensesData = item?.expenses || [];

                                    const expensesWithDescription = getExpensesData.amounts.map((amount, index) => ({
                                        amount: amount,
                                        comment: getExpensesData.descriptions[index]
                                    }));
                                    const getOthersData = item?.others_revenues || [];

                                    const othersWithDescription = getOthersData.amounts.map((amount, index) => ({
                                        amount: amount,
                                        comment: getOthersData.descriptions[index]
                                    }));

                                    return (
                                        <tr key={index}>
                                            <td className="p-2 border">{item?.date}</td>

                                            <td className="p-2 border">{item?.computer_revenues}</td>

                                            <td className="p-2 border">{item?.stationary_revenues}</td>

                                            <td className="p-2 border">{item?.photocopy_revenues}</td>

                                            <td onClick={() => { document.getElementById('modal_date').innerText = item?.date; setDetails(othersWithDescription); setModal(!modal); }} className="p-2 border cursor-pointer underline">{others}</td>

                                            <td onClick={() => { document.getElementById('modal_date').innerText = item?.date; setDetails(expensesWithDescription); setModal(!modal); }} className="p-2 border cursor-pointer underline">{expenses}</td>

                                            <td className={`p-2 border font-bold ${cash < 0 ? "text-red-500" : "text-green-500"}`}>
                                                {cash}
                                            </td>
                                        </tr>
                                    );
                                })}

                            </tbody>
                            <thead>
                                <tr className="text-pink-300">
                                    <th className="p-2 border">Total</th>
                                    <th className="p-2 border">{totalComputer}</th>
                                    <th className="p-2 border">{totalStationary}</th>
                                    <th className="p-2 border">{totalPhotocopy}</th>
                                    <th className="p-2 border">{totalOthers}</th>
                                    <th className="p-2 border">{totalExpenses}</th>
                                    <th className={`p-2 border font-bold ${totalCash < 0 ? 'text-red-500' : 'text-green-500'}`}>{totalCash}</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
            }
            <div className='flex items-center justify-center gap-5'>
                <button onClick={() => { handleDelete(selectedStartDate || organizedData[organizedData.length - 1]?.date, selectedEndDate || organizedData[0]?.date) }} className={` text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-sm lg:text-lg font-semibold`}>
                    Delete Data
                </button>
                <button onClick={handlePrint} className={`disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60 text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-sm lg:text-lg font-semibold`}>
                    Print
                </button>
            </div>

            <div ref={voucherPrintRef} className='nunito hidden'>
                <h1 className='text-2xl text-center font-bold my-4'>Accounts Record From {selectedStartDate ? selectedStartDate : allTRX[0]?.date} To {selectedEndDate ? selectedEndDate : allTRX[allTRX.length - 1]?.date}</h1>
                <div>
                    <table className="w-full text-center">
                        <thead>
                            <tr className="">
                                <th className="p-2 border border-black">Date</th>
                                <th className="p-2 border border-black">Computer</th>
                                <th className="p-2 border border-black">Stationary</th>
                                <th className="p-2 border border-black">Photocopy</th>
                                <th className="p-2 border border-black">Others</th>
                                <th className="p-2 border border-black">Expenses</th>
                                <th className="p-2 border border-black">Cash</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTRX?.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, index) => {

                                const others =
                                    (item?.others_revenues?.amounts || []).reduce((sum, i) => sum + i, 0);

                                const expenses =
                                    (item?.expenses?.amounts || []).reduce((sum, i) => sum + i, 0);

                                const cash =
                                    (item?.computer_revenues || 0) +
                                    (item?.stationary_revenues || 0) +
                                    (item?.photocopy_revenues || 0) +
                                    others -
                                    expenses;

                                return (
                                    <tr key={index}>
                                        <td className="p-2 border border-black">{item?.date}</td>

                                        <td className="p-2 border border-black">{item?.computer_revenues}</td>

                                        <td className="p-2 border border-black">{item?.stationary_revenues}</td>

                                        <td className="p-2 border border-black">{item?.photocopy_revenues}</td>

                                        <td className="p-2 border border-black">{others}</td>

                                        <td className="p-2 border border-black">{expenses}</td>

                                        <td className={`p-2 border font-bold border-black ${cash < 0 ? "text-red-500" : "text-green-500"}`}>
                                            {cash}
                                        </td>
                                    </tr>
                                );
                            })}

                        </tbody>
                        <thead>
                            <tr className="text-center">
                                <th className="p-2 border border-black">Total</th>
                                <th className="p-2 border border-black">{totalComputer - loadedTransactions?.computer_revenues}</th>
                                <th className="p-2 border border-black">{totalStationary - loadedTransactions?.stationary_revenues}</th>
                                <th className="p-2 border border-black">{totalPhotocopy - loadedTransactions?.photocopy_revenues}</th>
                                <th className="p-2 border border-black">{totalOthers - loadedTransactions?.others_revenues?.reduce((sum, item) => sum + item?.amount, 0)}</th>
                                <th className="p-2 border border-black">{totalExpenses - loadedTransactions?.expenses?.reduce((sum, item) => sum + item?.amount, 0)}</th>
                                <th className="p-2 border border-black">{totalCash - todayCash}</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>


        </div>
    );
};

export default ViewDailyTransactions;