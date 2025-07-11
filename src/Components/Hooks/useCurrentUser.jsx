import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Providers/AuthProvider';

const useCurrentUser = () => {
	const { user } = useContext(AuthContext);
	const [current_User, setCurrent_User] = useState({});
	const [isAdmin, setIsAdmin] = useState(false);
	const [isStaff, setIsStaff] = useState(false);
	const [userHookLoading, setUserHookLoading] = useState(false);

	useEffect(() => {
		setUserHookLoading(true);

		if (!user?.uid) {
			setUserHookLoading(false);
			return;
		}

		fetch(`http://localhost:5000/staff/uid_query/${user.uid}`)
			.then(res => res.json())
			.then(currentUserData => {
				if (currentUserData?.message === 'UID not found') {
					setIsStaff(false);
					setIsAdmin(false);
					setCurrent_User({});
				} else {
					setCurrent_User(currentUserData);

					if (currentUserData.user_category === 'admin') {
						setIsAdmin(true);
						setIsStaff(true);
					} else if (currentUserData.user_category === 'staff') {
						setIsStaff(true);
						setIsAdmin(false);
					} else {
						setIsAdmin(false);
						setIsStaff(false);
					}
				}
				setUserHookLoading(false);
			})
			.catch(() => {
				setIsAdmin(false);
				setIsStaff(false);
				setCurrent_User({});
				setUserHookLoading(false);
			});
	}, [user]);

	return [current_User, isAdmin, isStaff, userHookLoading];
};

export default useCurrentUser;