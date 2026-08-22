import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Providers/AuthProvider';
import NotAuthorized from '../Shared/NotAuthorized/NotAuthorized';
import Loading from '../Shared/Loading/Loading';
import { useNavigation } from 'react-router-dom';

const StaffRoute = ({ children }) => {

	const navigation = useNavigation();
	const { user, loading } = useContext(AuthContext);

	const [siteUser, setSiteUser] = useState(null);
	const [staffLoading, setStaffLoading] = useState(true);

	useEffect(() => {

		if (!user?.uid) {
			setSiteUser(null);
			setStaffLoading(false);
			return;
		}

		const checkStaff = async () => {

			setStaffLoading(true);

			try {


				const response = await fetch(
					`https://bismillah-enterprise-server.onrender.com/staff/uid_query/${user.uid}`
				);

				const gotData = await response.json();

				if (gotData) {
					setSiteUser(gotData);
				} else {
					setSiteUser(null);
				}

			} catch (error) {

				console.error('Staff verification failed:', error);
				setSiteUser(null);

			} finally {

				setStaffLoading(false);

			}
		};

		checkStaff();

	}, [user?.uid]);


	if (loading || staffLoading || navigation.state === "loading") {
		return <Loading />;
	}


	if (
		user &&
		(
			siteUser?.uid === user.uid ||
			siteUser?.user_category === 'admin'
		)
	) {
		return children;
	}


	return <NotAuthorized />;
};

export default StaffRoute;