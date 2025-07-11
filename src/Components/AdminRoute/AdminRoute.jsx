import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Providers/AuthProvider';
import Loading from '../Shared/Loading/Loading';
import { Navigate, useLocation } from 'react-router-dom';
import NotAuthorized from '../Shared/NotAuthorized/NotAuthorized';

const AdminRoute = ({children}) => {
	const { user } = useContext(AuthContext);
	const [siteUser, setSiteUser] = useState();
	const [adminLoading, setAdminLoading] = useState(false);
	const location = useLocation();

	useEffect(() => {
		setAdminLoading(true);
		fetch(`http://localhost:5000/staff/uid_query/${user?.uid}`).then(res => res.json()).then(gotData => {
			setSiteUser(gotData);
			setAdminLoading(false);
		})
	}, [user])


	if(adminLoading) {
		return <Loading></Loading>
	}
	if(siteUser?.user_category === 'admin') {
		return children;
	}
	return <NotAuthorized></NotAuthorized>
};

export default AdminRoute;