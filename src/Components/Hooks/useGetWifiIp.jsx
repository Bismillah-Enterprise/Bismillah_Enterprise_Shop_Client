import React, { useContext, useEffect, useState } from 'react';

const useGetWifiIp = () => {
	const [wifiIp, setWifiIp] = useState(null);
	useEffect(() => {
		fetch('http://localhost:5000/get_network_ip')
			.then(res => res.json())
			.then(data => {
				setWifiIp(data.ip);
			})
	}, [])

	return [wifiIp]
};

export default useGetWifiIp;