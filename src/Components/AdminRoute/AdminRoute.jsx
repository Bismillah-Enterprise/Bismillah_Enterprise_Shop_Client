import React from 'react';
import Loading from '../Shared/Loading/Loading';
import NotAuthorized from '../Shared/NotAuthorized/NotAuthorized';
import useAdmin from '../Hooks/useAdmin';
import useAuth from '../Hooks/useAuth';

const AdminRoute = ({ children }) => {

	const { user, loading } = useAuth();
	const [isAdmin, isAdminLoading] = useAdmin();

	// Firebase/Auth loading
	if (loading || isAdminLoading) {
		return (
			<div className="h-full">
				<Loading />
			</div>
		);
	}

	// User is authenticated and admin
	if (user && isAdmin) {
		return children;
	}

	return <NotAuthorized />;
};

export default AdminRoute;