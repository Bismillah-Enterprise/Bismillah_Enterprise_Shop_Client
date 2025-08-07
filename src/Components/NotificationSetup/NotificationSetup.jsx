import { useEffect } from "react";
import { getToken } from "firebase/messaging";
import { messaging } from "./firebase-config";
import Swal from "sweetalert2";

const VAPID_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY;

const NotificationSetup = () => {
    useEffect(() => {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                getToken(messaging, { vapidKey: VAPID_KEY })
                    .then((currentToken) => {
                        if (currentToken) {
                            console.log("Token:", currentToken);

                            // Send this token to your backend to store
                            fetch('https://bismillah-enterprise-server.onrender.com/store_token', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ token: currentToken }),
                            })
                                .then(() => {
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: 'Token Stored',
                                        showConfirmButton: false,
                                        timer: 1000,
                                    })
                                })
                        }
                    })
                    .catch(err => console.error("Token Error", err));
            }
        });
    }, []);

    return null;
};

export default NotificationSetup;