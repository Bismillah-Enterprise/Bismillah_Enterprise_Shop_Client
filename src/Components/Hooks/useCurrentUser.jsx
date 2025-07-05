import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Providers/AuthProvider';

const useCurrentUser = () => {
	const { user } = useContext(AuthContext);
	const [current_User, setCurrent_User] = useState({});
	const [isAdmin, setIsAdmin] = useState(false);
	const [isStaff, setIsStaff] = useState(false);
	const [userHookLoading, setUserHookLoading] = useState(false); // Local userHookLoading for the hook

	useEffect(() => {
		setUserHookLoading(true);
		if (!user?.uid) {
			setUserHookLoading(false);
			return;
		}

		fetch(`https://shop-manager-server.onrender.com/staff/uid_query/${user.uid}`)
			.then(res => res.json())
			.then(currentUserData => {
				if (currentUserData?.message === 'UID not found') {
					fetch(`https://shop-manager-server.onrender.com/user_request_uid/${user.uid}`)
						.then(res => res.json())
						.then(userRequestedData => {
							if (userRequestedData?.message === 'UID not found') {
								setIsStaff(false);
								setIsAdmin(false);
								setUserHookLoading(false);
							} else {
								setIsStaff(false);
								setIsAdmin(false);
								setUserHookLoading(false);
							}
						});
				} else {
					setCurrent_User(currentUserData);
					if (currentUserData.user_category === 'admin') {
						setIsAdmin(true);
						setIsStaff(true);
					} else if (currentUserData.user_category === 'staff') {
						setIsAdmin(false);
						setIsStaff(true);
					}
					setUserHookLoading(false);
				}
			});
	}, [user]);

	return [current_User, isAdmin, isStaff, userHookLoading];
};

export default useCurrentUser;
