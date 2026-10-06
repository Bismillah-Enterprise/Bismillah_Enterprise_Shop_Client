import React, { useState } from 'react';
import { FiCheck, FiClock, FiInbox, FiX } from 'react-icons/fi';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const API = 'https://bismillah-enterprise-server.onrender.com';

const alertTheme = {
	background: '#0b1f1b',
	color: '#f8fafc',
	confirmButtonColor: '#10b981',
	cancelButtonColor: '#ef4444',
};

const AdditionalRequest = () => {
	const requests = useLoaderData() || [];
	const navigate = useNavigate();
	const location = useLocation();

	const [processingUid, setProcessingUid] = useState(null);

	// Refresh current route after successful operation
	const refresh = () => {
		navigate(location.pathname, {
			replace: true,
		});
	};

	// ---------------------------------------------------------
	// Approve Request
	// ---------------------------------------------------------
	const handleApproveRequest = async (uid) => {
		if (!uid) {
			Swal.fire({
				...alertTheme,
				icon: 'error',
				title: 'Invalid Request',
				text: 'Request UID was not found.',
			});
			return;
		}

		const result = await Swal.fire({
			...alertTheme,
			title: 'Approve request?',
			text: 'The additional movement will be approved and the pending request will be removed.',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Approve',
			cancelButtonText: 'Cancel',
			reverseButtons: true,
		});

		if (!result.isConfirmed) return;

		try {
			setProcessingUid(uid);

			// Step 1: Approve movement
			const approveRes = await fetch(
				`${API}/additional_request_approve/${encodeURIComponent(uid)}`,
				{
					method: 'PUT',
					headers: {
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						additional_movement_status: true,
					}),
				}
			);

			if (!approveRes.ok) {
				throw new Error('Approval request failed.');
			}

			const approveData = await approveRes.json();

			// MongoDB updateOne normally returns matchedCount / modifiedCount.
			// If backend returns an explicit failure, stop here.
			if (
				approveData &&
				approveData.matchedCount !== undefined &&
				approveData.matchedCount === 0 &&
				approveData.upsertedCount === 0
			) {
				throw new Error('Staff record was not found.');
			}

			// Step 2: Remove pending request
			const deleteRes = await fetch(
				`${API}/additional_movement_request/${encodeURIComponent(uid)}`,
				{
					method: 'DELETE',
				}
			);

			if (!deleteRes.ok) {
				throw new Error(
					'Movement approved, but the pending request could not be removed.'
				);
			}

			await Swal.fire({
				...alertTheme,
				icon: 'success',
				title: 'Request Approved',
				text: 'Additional movement has been approved successfully.',
				showConfirmButton: false,
				timer: 1400,
			});

			refresh();
		} catch (error) {
			console.error('Approve request error:', error);

			Swal.fire({
				...alertTheme,
				icon: 'error',
				title: 'Approval Failed',
				text:
					error?.message ||
					'Something went wrong while approving the request.',
			});
		} finally {
			setProcessingUid(null);
		}
	};

	// ---------------------------------------------------------
	// Reject Request
	// ---------------------------------------------------------
	const handleRejectRequest = async (uid) => {
		if (!uid) {
			Swal.fire({
				...alertTheme,
				icon: 'error',
				title: 'Invalid Request',
				text: 'Request UID was not found.',
			});
			return;
		}

		const result = await Swal.fire({
			...alertTheme,
			title: 'Reject request?',
			text: 'This pending request will be rejected and removed.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Reject',
			cancelButtonText: 'Keep',
			reverseButtons: true,
		});

		if (!result.isConfirmed) return;

		try {
			setProcessingUid(uid);

			// Step 1: Set staff movement status to false
			const rejectRes = await fetch(
				`${API}/additional_request_approve/${encodeURIComponent(uid)}`,
				{
					method: 'PUT',
					headers: {
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						additional_movement_status: false,
					}),
				}
			);

			if (!rejectRes.ok) {
				throw new Error('Rejection request failed.');
			}

			const rejectData = await rejectRes.json();

			if (
				rejectData &&
				rejectData.matchedCount !== undefined &&
				rejectData.matchedCount === 0 &&
				rejectData.upsertedCount === 0
			) {
				throw new Error('Staff record was not found.');
			}

			/*
			 * IMPORTANT:
			 *
			 * This must use the pending-request DELETE endpoint.
			 *
			 * Wrong:
			 * /additional_request_approve/:uid
			 *
			 * Correct:
			 * /additional_movement_request/:uid
			 */
			const deleteRes = await fetch(
				`${API}/additional_movement_request/${encodeURIComponent(uid)}`,
				{
					method: 'DELETE',
				}
			);

			if (!deleteRes.ok) {
				throw new Error(
					'Request was rejected, but the pending request could not be removed.'
				);
			}

			await Swal.fire({
				...alertTheme,
				icon: 'success',
				title: 'Request Rejected',
				text: 'Additional movement request has been rejected.',
				showConfirmButton: false,
				timer: 1400,
			});

			refresh();
		} catch (error) {
			console.error('Reject request error:', error);

			Swal.fire({
				...alertTheme,
				icon: 'error',
				title: 'Rejection Failed',
				text:
					error?.message ||
					'Something went wrong while rejecting the request.',
			});
		} finally {
			setProcessingUid(null);
		}
	};

	return (
		<div className="relative min-h-full w-full px-1 py-3 text-slate-100 sm:px-2 lg:p-5">

			{/* Ambient Background */}
			<div className="pointer-events-none fixed -left-32 -top-32 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />

			<div className="pointer-events-none fixed -right-32 top-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-[110px]" />

			<div className="relative mx-auto max-w-6xl">

				{/* Header */}
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

					<div>
						<p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
							<FiInbox />
							Approval Center
						</p>

						<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
							Additional Movement Requests
						</h1>

						<p className="mt-1 text-sm text-slate-400">
							Review and process pending staff movement requests.
						</p>
					</div>

					{/* Pending Counter */}
					<div className="rounded-2xl border border-emerald-400/15 bg-[#0b1f1b]/70 px-4 py-3 backdrop-blur-xl">
						<p className="text-xs text-slate-500">
							Pending
						</p>

						<p className="text-2xl font-bold text-emerald-300">
							{requests.length}
						</p>
					</div>

				</div>

				{/* Empty State */}
				{requests.length === 0 ? (

					<div className="rounded-3xl border border-emerald-400/10 bg-[#0b1f1b]/70 p-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">

						<FiCheck className="mx-auto mb-4 text-4xl text-emerald-400" />

						<h2 className="text-lg font-semibold">
							All caught up
						</h2>

						<p className="mt-1 text-sm text-slate-500">
							There are no additional movement requests right now.
						</p>

					</div>

				) : (

					/* Request List */
					<div className="space-y-3">

						{requests.map((requestData) => {

							const uid = requestData?.uid;
							const busy = processingUid === uid;

							return (
								<div
									key={requestData?._id || uid}
									className="group rounded-2xl border border-emerald-400/10 bg-[#0b1f1b]/65 p-4 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-[#0d241f]/80 sm:p-5"
								>

									<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

										{/* Request Information */}
										<div className="flex min-w-0 items-center gap-4">

											<div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-cyan-400/15 bg-cyan-400/5 text-cyan-300">
												<FiClock className="text-xl" />
											</div>

											<div className="min-w-0">

												<h2 className="truncate text-base font-semibold text-white sm:text-lg">
													{requestData?.name || 'Unnamed Staff'}
												</h2>

												<p className="mt-1 text-xs text-slate-500">
													Additional movement request
												</p>

											</div>

										</div>

										{/* Action Buttons */}
										<div className="flex flex-wrap gap-2 md:justify-end">

											{/* Approve */}
											<button
												type="button"
												disabled={busy}
												onClick={() => handleApproveRequest(uid)}
												className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-50"
											>
												<FiCheck />

												{busy
													? 'Processing...'
													: 'Approve'}
											</button>

											{/* Reject */}
											<button
												type="button"
												disabled={busy}
												onClick={() => handleRejectRequest(uid)}
												className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-400/5 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
											>
												<FiX />

												{busy
													? 'Processing...'
													: 'Reject'}
											</button>

										</div>

									</div>

								</div>
							);
						})}

					</div>

				)}

			</div>
		</div>
	);
};

export default AdditionalRequest;