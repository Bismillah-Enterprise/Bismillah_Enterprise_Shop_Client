import React, { useEffect, useRef } from 'react';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';

const RevenueTransectionsDetials = () => {
    const shopTransections = useLoaderData();
    console.log(shopTransections)
    const { revenue_transections, total_revenue_amount, month_name } = shopTransections[0];
    console.log(revenue_transections);
    const location = useLocation();
    const from = location?.state?.pathname;
    const navigate = useNavigate();


    const revenueTransectionsPrintRef = useRef();

    const handlePrint = () => {
        const printContents = revenueTransectionsPrintRef.current.innerHTML;
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
          ${printContents}
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

    return (
        <div className='pb-10'>
            <div className='flex items-center justify-center mt-8 mb-8'>
                <Link to={from}>
                    <button className="hidden md:block text-pink-200 cursor-pointer shadow-md hover:shadow-lg shadow-pink-300 px-5 py-1 rounded-md text-md lg:text-lg font-semibold">
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
                            revenue_transections?.map(transection =>
                                <tr className='text-pink-200'>
                                    <td>{transection.transection_date}</td>
                                    <td>{transection.transection_id}</td>
                                    <td className='max-w-24 lg:max-w-auto text-wrap overflow-scroll scrollbar-hide cursor-context-menu'>{transection.transection_explaination}</td>
                                    <td>{transection.transection_amount}</td>
                                </tr>
                            )
                        }
                        <tr className='text-pink-300'>
                            <th colSpan={3} className='p-2 border text-right'>Total Revenue Amount</th>
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
                    <img className='w-24 h-24' src='https://i.ibb.co/01Zf9m1/logo.png'></img>
                </div>
                <div className='flex items-center justify-center nunito'>
                    <h1 className="nunito text-lg lg:text-2xl text-center font-semibold px-5 py-2 border-2 rounded-lg text-black">
                        Revenue Transection Details of {month_name}
                    </h1>
                </div>
                <div className="flex items-center justify-center mt-5 overflow-x-scroll sm:overflow-x-hidden overflow-y-hidden scrollbar-hide text-xs lg:text-lg">
                    <table className="nunito min-w-[380px] sm:min-w-[380px]">
                        <tbody>
                            <tr className='text-black'>
                                <th className='p-2 border'>Date</th>
                                <th className='p-2 border'>Transection Id</th>
                                <th className='p-2 border'>Transection Explaination</th>
                                <th className='p-2 border'>Ammount</th>
                            </tr>
                            {
                                revenue_transections?.map(transection =>
                                    <tr className='text-black'>
                                        <td className='p-2 border'>{transection.transection_date}</td>
                                        <td className='p-2 border'>{transection.transection_id}</td>
                                        <td className='max-w-24 lg:max-w-auto text-wrap cursor-context-menu p-2 border'>{transection.transection_explaination}</td>
                                        <td className='p-2 border text-center'>{transection.transection_amount}</td>
                                    </tr>
                                )
                            }
                            <tr className='text-black'>
                                <th colSpan={3} className='p-2 border text-right'>Total Revenue Amount</th>
                                <th className='p-2 border'>{total_revenue_amount}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

export default RevenueTransectionsDetials;