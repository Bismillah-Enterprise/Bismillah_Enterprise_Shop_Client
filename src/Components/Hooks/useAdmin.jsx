import React, { useContext, useEffect, useState } from 'react';
import AuthProvider from '../Providers/AuthProvider';
import useAuth from './useAuth';

const useAdmin = () => {
    const { user } = useAuth();
    const [isAdminLoading, setIsAdminLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        const checkAdmin = async () => {
            await fetch(`https://bismillah-enterprise-server.onrender.com/staff/uid_query/${user?.uid}`).then(res => res.json()).then(gotData => {
                if (gotData?.user_category !== 'admin') {
                    setIsAdmin(false);
                    setIsAdminLoading(false)
                }
                else {
                    setIsAdmin(true);
                    setIsAdminLoading(false);
                }
                setIsAdminLoading(false);
            })
        }
        checkAdmin();
    }, [user])
    return [isAdmin, isAdminLoading];
};

export default useAdmin;