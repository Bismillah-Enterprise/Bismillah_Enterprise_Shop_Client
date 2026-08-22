import React, { useContext, useMemo, useState } from 'react';
import { FiSearch, FiShield, FiTrash2, FiUser } from 'react-icons/fi';
import { AuthContext } from '../../Providers/AuthProvider';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const API = 'https://bismillah-enterprise-server.onrender.com';

const alertTheme = {
	background: '#0b1f1b',
	color: '#f8fafc',
	confirmButtonColor: '#10b981',
	cancelButtonColor: '#ef4444',
};

const UserManipulation = () => {
	const { user } = useContext(AuthContext);
	const allStaffs = useLoaderData() || [];
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const [deletingId, setDeletingId] = useState(null);

	const filteredUsers = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) return allStaffs;
		return allStaffs.filter((staff) =>
			`${staff?.name || ''} ${staff?.email || ''} ${staff?.user_category || ''}`.toLowerCase().includes(query)
		);
	}, [allStaffs, search]);

	const handleDelete = async (id, name) => {
		const result = await Swal.fire({
			...alertTheme,
			title: 'Delete user?',
			text: `${name || 'This user'} will be removed from the staff collection.`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			cancelButtonText: 'Cancel',
		});

		if (!result.isConfirmed) return;

		try {
			setDeletingId(id);
			const response = await fetch(`${API}/staff/${id}`, { method: 'DELETE' });
			if (!response.ok) throw new Error('Delete request failed.');

			await Swal.fire({
				...alertTheme,
				icon: 'success',
				title: 'User Deleted',
				showConfirmButton: false,
				timer: 1200,
			});
			navigate('/admin/user_manipulation');
		} catch (error) {
			Swal.fire({ ...alertTheme, icon: 'error', title: 'Delete Failed', text: error.message });
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div className="relative min-h-full w-full px-1 py-3 sm:px-2 lg:p-5 text-slate-100">
			<div className="pointer-events-none fixed -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[130px]" />
			<div className="pointer-events-none fixed top-1/3 -right-40 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[140px]" />
			<div className="pointer-events-none fixed -bottom-48 left-[35%] h-[460px] w-[460px] rounded-full bg-violet-500/10 blur-[150px]" />

			<div className="relative mx-auto max-w-6xl">
				<div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400"><FiShield /> Administration</p>
						<h1 className="text-2xl font-bold sm:text-3xl">User Account Manipulation</h1>
						<p className="mt-1 text-sm text-slate-500">Manage staff accounts and remove unwanted records.</p>
					</div>
					<div className="relative w-full sm:w-80">
						<FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search name, email or role..."
							className="w-full rounded-xl border border-emerald-400/10 bg-[#0b1f1b]/70 py-3 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-xl focus:border-emerald-400/30"
						/>
					</div>
				</div>

				<div className="mb-4 flex items-center justify-between text-xs text-slate-500">
					<span>{filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}</span>
					<span>Signed in as {user?.email || 'admin'}</span>
				</div>

				<div className="grid gap-3">
					{filteredUsers.map((staff) => {
						const role = staff?.user_category || 'staff';
						const isDeleting = deletingId === staff._id;

						return (
							<div
								key={staff._id}
								className="rounded-2xl border border-emerald-400/10 bg-[#0b1f1b]/65 p-4 shadow-xl shadow-black/20 backdrop-blur-xl transition hover:border-cyan-400/20 sm:p-5"
							>
								<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
									<div className="flex min-w-0 items-center gap-4">
										<div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-cyan-400/15 bg-cyan-400/5 text-cyan-300">
											<FiUser />
										</div>
										<div className="min-w-0">
											<h2 className="truncate font-semibold text-white sm:text-lg">{staff?.name || 'Unnamed User'}</h2>
											<p className="truncate text-xs text-slate-500">{staff?.email || 'No email available'}</p>
											<span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${role === 'admin' ? 'border-violet-400/20 bg-violet-400/10 text-violet-300' : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'}`}>
												{role}
											</span>
										</div>
									</div>

									<button
										disabled={isDeleting}
										onClick={() => handleDelete(staff._id, staff?.name)}
										className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-400/5 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
									>
										<FiTrash2 /> {isDeleting ? 'Deleting...' : 'Delete User'}
									</button>
								</div>
							</div>
						);
					})}

					{filteredUsers.length === 0 && (
						<div className="rounded-2xl border border-white/5 bg-[#0b1f1b]/60 p-12 text-center text-sm text-slate-500">
							No matching users found.
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default UserManipulation;
