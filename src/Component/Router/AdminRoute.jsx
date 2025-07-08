import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Provider/AuthProvider';

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (!user) return;

        // ✅ Only run this if user is available
        fetch(`https://shop-manager-server.onrender.com/staff/uid_query/${user.uid}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.user_category === 'admin') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
                setChecking(false);
            })
            .catch(() => {
                setIsAdmin(false);
                setChecking(false);
            });
    }, [user]); // ✅ depend on `user`, not `isAdmin`

    // ⏳ Still checking or auth not ready
    if (loading || checking) {
        return <div className="text-center text-pink-500 mt-10">⏳ Checking Admin Access...</div>;
    }

    // 🚫 Not logged in or not admin
    if (!user || !isAdmin) {
        return <Navigate to="/not_authorized" replace />;
    }

    // ✅ Authorized admin
    return children;
};

export default AdminRoute;