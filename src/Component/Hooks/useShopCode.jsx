import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import useRefetch from './useRefetch';

const useShopCode = () => {
	const {user} = useContext(AuthContext)
	const [shopCode, setShopCode] = useState();
	const [refetch, setRefetch] = useRefetch();
	useEffect(() => {
		fetch(`https://shop-manager-server.onrender.com/shop_code/${import.meta.env.VITE_shop_code_object_id}`)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				setShopCode(data[0].shop_code)
			})
	}, [user, refetch]);

	return [shopCode]
};

export default useShopCode;