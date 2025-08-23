import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Providers/AuthProvider';
import Loading from '../Shared/Loading/Loading';
import { Navigate, useLocation } from 'react-router-dom';
import NotAuthorized from '../Shared/NotAuthorized/NotAuthorized';
import useAdmin from '../Hooks/useAdmin';
import useAuth from '../Hooks/useAuth';

const AdminRoute = ({ children }) => {
	const { user, loading } = useAuth();
	const [isAdminLoading, setIsAdminLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);
	useEffect(() => {
		const checkAdmin = async () => {
			await fetch(`https://bismillah-enterprise-server.onrender.com/staff/uid_query/${user?.uid}`).then(res => res.json()).then(gotData => {
				if (gotData?.user_category !== 'admin') {
					setIsAdmin(false);
					setIsAdminLoading(false)
				}
				else {
					setIsAdmin(true);
					setIsAdminLoading(false);
				}
				setIsAdminLoading(false);
			})
		}
		checkAdmin();
	}, [user, isAdminLoading])

	if (isAdminLoading) {
		return <div className='h-full'><Loading></Loading></div>
	}
	if (user && isAdmin) {
		return children;
	}
	return <NotAuthorized></NotAuthorized>
};

export default AdminRoute;