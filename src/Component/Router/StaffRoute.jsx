import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Provider/AuthProvider';

const StaffRoute = ({children}) => {

	const { user, loading } = useContext(AuthContext);
	const [isStaff, setIsStaff] = useState(null);
	const [checking, setChecking] = useState(true);

	useEffect(() => {
		fetch(`https://shop-manager-server.onrender.com/staff/uid_query/${user.uid}`)
			.then(res => res.json())
			.then(data => {
				if (data?.message?.message !== 'UID not find') {
					console.log(data)
					setIsStaff(true);
				} else {
					setIsStaff(false);
				}
				setChecking(false);
			})
			.catch(() => {
				setIsStaff(false);
				setChecking(false);
			});
	}, [user]);

	if (loading || checking) {
		return <div className="text-center text-pink-500 mt-10">⏳ Checking Admin Access...</div>;
	}

	if (!user || !isStaff) {
		return <Navigate to="/not_authorized" replace />;
	}

	return children;
};

export default StaffRoute;