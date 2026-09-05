import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Providers/AuthProvider';

const useShopCode = () => {
	const { user } = useContext(AuthContext)
	const [shopCode, setShopCode] = useState();
	useEffect(() => {
		fetch(`http://localhost:5000/shop_code`)
			.then(res => res.json())
			.then(data => {
				setShopCode(data.shop_code)
			})
	}, [user]);

	return [shopCode]
};

export default useShopCode;