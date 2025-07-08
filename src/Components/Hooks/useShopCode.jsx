import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Providers/AuthProvider';

const useShopCode = () => {
	const { user } = useContext(AuthContext)
	const [shopCode, setShopCode] = useState();
	useEffect(() => {
		fetch(`https://shop-manager-server.onrender.com/shop_code/${import.meta.env.VITE_shop_code_object_id}`)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				setShopCode(data[0].shop_code)
			})
	}, [user]);

	return [shopCode]
};

export default useShopCode;