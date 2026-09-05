import React, { useState } from 'react';
import Swal from 'sweetalert2';
import useShopCode from '../../Hooks/useShopCode';

const SetShopCode = () => {
	const [shopCode] = useShopCode();

	const [isSetShopCode, setIsSetShopCode] = useState(false);
	const [isChange, setIsChange] = useState(false);
	const [loading, setLoading] = useState(false);
	const [newShopCode, setNewShopCode] = useState('');
	const [visibleCode, setVisibleCode] = useState('');

	const handleShowShopCode = () => {
		setVisibleCode(shopCode || '');
		setIsSetShopCode(true);
	};

	const handleChangeShopCode = async () => {
		const shop_code = newShopCode.trim();

		if (!shop_code) {
			Swal.fire({
				icon: 'warning',
				title: 'Enter a shop code',
				showConfirmButton: false,
				timer: 1200,
			});

			return;
		}

		setLoading(true);

		try {
			const response = await fetch(
				'http://localhost:5000/shop_code',
				{
					method: 'POST',
					headers: {
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						shop_code,
					}),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					data?.message || 'Failed to change shop code'
				);
			}

			setNewShopCode('');
			setIsChange(false);
			setIsSetShopCode(false);

			await Swal.fire({
				position: 'center',
				icon: 'success',
				title: 'Shop Code Changed Successfully',
				showConfirmButton: false,
				timer: 1000,
			});

			window.location.reload();
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Unable to Change Shop Code',
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
				<div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

				<div className="relative z-10 text-center">
					<p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400/70">
						Security Settings
					</p>

					<h2 className="mt-1 text-2xl font-bold text-white">
						Shop Code
					</h2>

					<p className="mt-2 text-sm text-slate-500">
						View or update the secure access code for your shop.
					</p>
				</div>
			</div>

			{/* Main card */}
			<div className="mt-7 flex justify-center">

				<div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-400/10 bg-[#081714]/90 p-6 shadow-[0_25px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-9">

					<div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

					<div className="relative z-10">

						{/* Icon */}
						<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-400/10 text-2xl text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
							#
						</div>

						{/* Code display */}
						{!isChange ? (
							<div className="mt-6 text-center">

								<p className="text-xs uppercase tracking-[0.2em] text-slate-500">
									Current Shop Code
								</p>

								<div className="mt-4 min-h-[72px] rounded-2xl border border-emerald-400/10 bg-[#071311] px-5 py-4 flex items-center justify-center">

									{visibleCode ? (
										<span className="break-all font-mono text-2xl font-bold tracking-[0.25em] text-emerald-300 sm:text-3xl">
											{visibleCode}
										</span>
									) : (
										<span className="text-sm text-slate-600">
											Code is hidden
										</span>
									)}

								</div>
							</div>
						) : (
							<div className="mt-6">

								<div className="mb-3">
									<h3 className="font-semibold text-white">
										Enter New Shop Code
									</h3>

									<p className="mt-1 text-xs text-slate-500">
										Choose a secure code and keep it private.
									</p>
								</div>

								<input
									id="new_shop_code"
									type="text"
									value={newShopCode}
									onChange={(event) =>
										setNewShopCode(event.target.value)
									}
									onKeyDown={(event) => {
										if (event.key === 'Enter') {
											handleChangeShopCode();
										}
									}}
									placeholder="Enter new shop code"
									disabled={loading}
									className="h-14 w-full rounded-2xl border border-emerald-400/10 bg-[#071311] px-5 font-mono text-white outline-none placeholder:font-sans placeholder:text-slate-600 transition-all duration-300 focus:border-emerald-400/30 focus:shadow-[0_0_30px_rgba(16,185,129,0.08)] disabled:opacity-50"
								/>

							</div>
						)}

						{/* Actions */}
						<div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">

							{!isChange ? (
								<button
									onClick={handleShowShopCode}
									className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-3 font-semibold text-cyan-200 transition-all duration-300 hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]"
								>
									{isSetShopCode
										? 'Refresh Current Code'
										: 'Show Current Code'}
								</button>
							) : (
								<button
									onClick={handleChangeShopCode}
									disabled={loading}
									className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 font-semibold text-emerald-200 transition-all duration-300 hover:border-emerald-300/40 hover:bg-emerald-400/15 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] disabled:cursor-not-allowed disabled:opacity-50"
								>
									{loading ? 'Changing...' : 'Change Shop Code'}
								</button>
							)}

							{!isChange ? (
								<button
									onClick={() => setIsChange(true)}
									disabled={!isSetShopCode}
									className="rounded-2xl border border-violet-400/20 bg-violet-400/5 px-5 py-3 font-semibold text-violet-200 transition-all duration-300 hover:border-violet-300/40 hover:bg-violet-400/10 hover:shadow-[0_0_30px_rgba(139,92,246,0.08)] disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800/20 disabled:text-slate-600 disabled:shadow-none"
								>
									Change The Code
								</button>
							) : (
								<button
									onClick={() => {
										setIsChange(false);
										setNewShopCode('');
									}}
									disabled={loading}
									className="rounded-2xl border border-slate-700 bg-white/[0.02] px-5 py-3 font-semibold text-slate-300 transition-all duration-300 hover:border-slate-600 hover:bg-white/[0.04] disabled:opacity-50"
								>
									Cancel
								</button>
							)}

						</div>

						{!isSetShopCode && !isChange && (
							<p className="mt-5 text-center text-xs text-slate-600">
								You must reveal the current code before changing it.
							</p>
						)}

					</div>
				</div>
			</div>
		</div>
	);
};

export default SetShopCode;