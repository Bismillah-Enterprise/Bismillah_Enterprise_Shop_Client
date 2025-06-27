import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Provider/AuthProvider';

const useIsAdmin = () => {
	const { user } = useContext(AuthContext);
	const [isAdmin, setIsAdmin] = useState(false);
	useEffect(() => {
		fetch(`http://localhost:5000/staff/uid_query/${user?.uid}`)
			.then(res => res.json())
			.then(data => {
				console.log(data)
				if (data?.user_category === 'admin') {
					setIsAdmin(true)
				}
				else {
					setIsAdmin(false)
				}
			})
	}, [user]);

	return [isAdmin]
};

export default useIsAdmin;