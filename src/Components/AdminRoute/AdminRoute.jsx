import React from 'react';
import Loading from '../Shared/Loading/Loading';
import NotAuthorized from '../Shared/NotAuthorized/NotAuthorized';
import useAdmin from '../Hooks/useAdmin';
import useAuth from '../Hooks/useAuth';
import { useNavigation } from 'react-router-dom';

const AdminRoute = ({ children }) => {

	const navigation = useNavigation();
	const { user, loading } = useAuth();
	const [isAdmin, isAdminLoading] = useAdmin();

	// Firebase/Auth loading
	if (loading || isAdminLoading || navigation.state === "loading") {
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

	// User is not authorized
	return <NotAuthorized />;
};

export default AdminRoute;