import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const NoticePanel = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const newNoticeRef = useRef();
    const [loading, setLoading] = useState(false);

    const handleChangeNotice = async () => {
        const newNotice = newNoticeRef.current?.value?.trim();

        if (!newNotice) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a notice',
                showConfirmButton: false,
                timer: 1200,
            });

            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                'https://bismillah-enterprise-server.onrender.com/notice_panel',
                {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        notice: newNotice,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || 'Failed to update notice');
            }

            newNoticeRef.current.value = '';

            await Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Notice Changed Successfully',
                showConfirmButton: false,
                timer: 1000,
            });

            navigate(location.pathname);
        } catch (error) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Failed to Change Notice',
                text: error?.message || 'Something went wrong.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-full pb-10 text-white">

            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-400/10 bg-[#0a1a17]/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">

                <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

                <div className="relative z-10 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400/70">
                        Administration
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-white">
                        Notice Board
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Update the notice displayed throughout the shop system.
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="mt-7 flex justify-center">

                <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-400/10 bg-[#081714]/90 p-5 shadow-[0_25px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">

                    <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

                    <div className="relative z-10">

                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-xl text-cyan-300">
                                !
                            </div>

                            <div>
                                <h3 className="font-semibold text-white">
                                    Enter Your New Notice
                                </h3>

                                <p className="text-xs text-slate-500">
                                    Keep the message short and clear.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                ref={newNoticeRef}
                                type="text"
                                maxLength={250}
                                placeholder="Type your new notice..."
                                disabled={loading}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        handleChangeNotice();
                                    }
                                }}
                                className="h-14 w-full rounded-2xl border border-emerald-400/10 bg-[#071311] px-5 text-sm text-white outline-none placeholder:text-slate-600 transition-all duration-300 focus:border-emerald-400/30 focus:bg-emerald-400/[0.02] focus:shadow-[0_0_30px_rgba(16,185,129,0.08)] disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <button
                            onClick={handleChangeNotice}
                            disabled={loading}
                            className="mt-5 w-full rounded-2xl border border-emerald-400/20 bg-gradient-to-r from-emerald-400/10 via-cyan-400/10 to-violet-400/10 px-6 py-3 font-semibold text-emerald-200 transition-all duration-300 hover:border-emerald-300/40 hover:shadow-[0_0_35px_rgba(16,185,129,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? 'Updating Notice...' : 'Set New Notice'}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticePanel;