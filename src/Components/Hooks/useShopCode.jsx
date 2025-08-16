import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Providers/AuthProvider';

const useShopCode = () => {
	const { user } = useContext(AuthContext)
	const [shopCode, setShopCode] = useState();
	useEffect(() => {
		fetch(`https://bismillah-enterprise-server.onrender.com/shop_code`)
			.then(res => res.json())
			.then(data => {
				setShopCode(data.shop_code)
			})
	}, [user]);

	return [shopCode]
};

export default useShopCode;