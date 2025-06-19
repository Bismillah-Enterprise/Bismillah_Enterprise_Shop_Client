import React from 'react';
import { useLoaderData } from 'react-router-dom';

const UserRequest = () => {
    const userRequest = useLoaderData();
    console.log(userRequest)
    return (
        <div>
           {
            
           }
        </div>
    );
};

export default UserRequest;