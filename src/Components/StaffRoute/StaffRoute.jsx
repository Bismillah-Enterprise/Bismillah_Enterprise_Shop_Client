import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Providers/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import NotAuthorized from '../Shared/NotAuthorized/NotAuthorized';
import Loading from '../Shared/Loading/Loading';

const StaffRoute = ({children}) => {
	const { user, loading, setLoading } = useContext(AuthContext);
	const [siteUser, setSiteUser] = useState();
	const [staffLoading, setStaffLoading] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true);
		setStaffLoading(true);
		fetch(`https://bismillah-enterprise-server.onrender.com/staff/uid_query/${user?.uid}`).then(res => res.json()).then(gotData => {
			if(gotData) {
				setSiteUser(gotData);
				setStaffLoading(false);
				setLoading(false);

			}
			else{
				navigate('/');
			}
		})
	}, [user])


	if (loading || staffLoading) {
		return <Loading></Loading>
	}
	if (siteUser?.uid === user?.uid || siteUser?.user_category === 'admin') {
		return children;
	}
	return <NotAuthorized></NotAuthorized>
};

export default StaffRoute;