import React, { useEffect, useRef } from 'react';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';

const RevenueTransectionsDetials = () => {
    const shopTransections = useLoaderData();
    console.log(shopTransections)
    const { revenue_transections, total_revenue_amount, month_name } = shopTransections[0];
    console.log(revenue_transections);
    const location = useLocation();
    const from = location.state?.pathname;
    const navigate = useNavigate();


    const revenueTransectionsPrintRef = useRef();

    const handlePrint = () => {
        const printContents = revenueTransectionsPrintRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        navigate(location.pathname)
    };

    return (
        <div className='pb-10'>
            <div className='flex items-center justify-center mt-8 mb-8'>
                <Link to={from}>
                    <button className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                        Back
                    </button>
                </Link>
            </div>
            <div className='flex items-center justify-center nunito'>
                <h1 className="nunito text-lg lg:text-2xl text-center font-semibold px-5 py-2 border-2 rounded-lg text-pink-300">
                    Revenue Transections Details of {month_name}
                </h1>
            </div>
            <div className="flex items-center justify-center mt-5 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg">
                <table className="nunito min-w-[380px] sm:min-w-[70%]">
                    <tbody>
                        <tr className='text-pink-300'>
                            <th>Date</th>
                            <th>Transection Id</th>
                            <th>Transection Explaination</th>
                            <th>Ammount</th>
                        </tr>
                        {
                            revenue_transections.map(transection =>
                                <tr className='text-pink-200'>
                                    <td>{transection.transection_date}</td>
                                    <td>{transection.transection_id}</td>
                                    <td className='max-w-[100px] lg:max-w-auto text-wrap overflow-scroll scrollbar-hide cursor-context-menu'>{transection.transection_explaination}</td>
                                    <td>{transection.transection_amount}</td>
                                </tr>
                            )
                        }
                        <tr className='text-pink-300'>
                            <th></th>
                            <th></th>
                            <th>Total Revenue Amount</th>
                            <th>{total_revenue_amount}</th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='flex items-center justify-center mt-5 mb-10'>
                <button onClick={handlePrint} className="text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
                    Print
                </button>
            </div>
            <div ref={revenueTransectionsPrintRef} className='nunito hidden'>
                <div>
                    <div className='text-center text-4xl font-bold'><h1>BISMILLAH ENTERPRISE</h1></div>
                </div>
                <div className='flex items-center justify-center my-3'>
                    <img className='w-[100px] h-[100px]' src='https://i.ibb.co/01Zf9m1/logo.png'></img>
                </div>
                <div className='flex items-center justify-center nunito'>
                    <h1 className="nunito text-lg lg:text-2xl text-center font-semibold px-5 py-2 border-2 rounded-lg text-black">
                        Revenue Transection Details of {month_name}
                    </h1>
                </div>
                <div className="flex items-center justify-center mt-5 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg">
                    <table className="nunito min-w-[380px] sm:min-w-[70%]">
                        <tbody>
                            <tr className='text-black'>
                                <th>Date</th>
                                <th>Transection Id</th>
                                <th>Transection Explaination</th>
                                <th>Ammount</th>
                            </tr>
                            {
                                revenue_transections.map(transection =>
                                    <tr className='text-black'>
                                        <td>{transection.transection_date}</td>
                                        <td>{transection.transection_id}</td>
                                        <td className='max-w-[100px] lg:max-w-auto text-wrap overflow-scroll scrollbar-hide cursor-context-menu'>{transection.transection_explaination}</td>
                                        <td>{transection.transection_amount}</td>
                                    </tr>
                                )
                            }
                            <tr className='text-black'>
                                <th></th>
                                <th></th>
                                <th>Total Revenue Amount</th>
                                <th>{total_revenue_amount}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

export default RevenueTransectionsDetials;