import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Providers/AuthProvider';
import Loading from '../Shared/Loading/Loading';
import { Navigate, useLocation } from 'react-router-dom';
import NotAuthorized from '../Shared/NotAuthorized/NotAuthorized';
import useAdmin from '../Hooks/useAdmin';
import useAuth from '../Hooks/useAuth';

const AdminRoute = ({ children }) => {
	const { user, loading } = useAuth();
	const [adminLoading, setAdminLoading] = useState(false);
	const [isAdmin, isAdminLoading] = useAdmin();

	if (isAdminLoading) {
		return <div className='h-full'><Loading></Loading></div>
	}
	if (user && isAdmin) {
		return children;
	}
	return <NotAuthorized></NotAuthorized>
};

export default AdminRoute;