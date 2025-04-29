import { useEffect, useState } from "react";
import apiUrl from "../config";

const useCheckSession = () => {
    const [alreadyConnect, setAlreadyConnect] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch(`${apiUrl}/check-session`, {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await response.json();

                if (data.loggedIn) {
                    setAlreadyConnect(true);
                } else {
                    setAlreadyConnect(false);
                }
            } catch (error) {
                console.error('Erreur lors de la vérification de session', error);
                setAlreadyConnect(false);
            }
        };

        checkSession().then(r => null);
    }, []);

    return alreadyConnect;
};

export default useCheckSession;