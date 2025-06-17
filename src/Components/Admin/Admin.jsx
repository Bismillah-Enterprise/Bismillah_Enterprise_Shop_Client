import React from 'react';
import { useLoaderData } from 'react-router-dom';

const Admin = () => {
    const allStaffs = useLoaderData();
    return (
        <div>
            {
                allStaffs.map(staff => <div key={staff._id}>{staff.name}</div>)
            }
        </div>
    );
};

export default Admin;