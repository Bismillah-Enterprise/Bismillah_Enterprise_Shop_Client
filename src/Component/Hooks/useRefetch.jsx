import React, { useState } from 'react';

const useRefetch = () => {
	const [refetch, setRefetch] = useState(false);

	return [refetch, setRefetch];
};

export default useRefetch;