import { useEffect, useState } from 'react';
import useAuth from './useAuth';

const useAdmin = () => {

    const { user } = useAuth();

    const [isAdminLoading, setIsAdminLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {

        if (!user?.uid) {
            setIsAdmin(false);
            setIsAdminLoading(false);
            return;
        }

        const checkAdmin = async () => {

            setIsAdminLoading(true);

            try {

                const response = await fetch(
                    `https://bismillah-enterprise-server.onrender.com/staff/uid_query/${user.uid}`
                );

                const gotData = await response.json();

                setIsAdmin(
                    gotData?.user_category === 'admin'
                );

            } catch (error) {

                console.error(
                    'Admin verification failed:',
                    error
                );

                setIsAdmin(false);

            } finally {

                setIsAdminLoading(false);

            }
        };

        checkAdmin();

    }, [user?.uid]);

    return [isAdmin, isAdminLoading];
};

export default useAdmin;