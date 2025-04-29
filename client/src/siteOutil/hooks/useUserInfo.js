import { useEffect, useState } from 'react';
import apiUrl from "../../config";

const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`${apiUrl}/user/info`, {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await response.json();

                if (data.success) {
                    setUserInfo(data.userInfo);
                } else {
                    console.error('Échec de la récupération des informations de l\'utilisateur :', data.message || data.error);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
            }
        };

        fetchUserInfo().then(r => null);
    }, []);

    return { userInfo };
};

export default useUserInfo;