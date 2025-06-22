import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Provider/AuthProvider';

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(null);
    const [checking, setChecking] = useState(true);
    console.log(user)

    useEffect(() => {
        if (user?.email) {
            fetch(`http://localhost:5000/staff`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({email: user?.email})
            })
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0 && data[0].user_category === 'admin') {
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
        } else {
            setChecking(false);
        }
    }, [user]);

    if (loading || checking) {
        return <div className="text-center text-pink-500 mt-10">⏳ Checking Admin Access...</div>;
    }

    if (!user || !isAdmin) {
        return <Navigate to="/not_authorized" replace />;
    }

    return children;
};

export default AdminRoute;