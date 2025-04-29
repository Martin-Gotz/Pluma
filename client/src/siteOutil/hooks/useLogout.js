import apiUrl from "../../config";
import {useNavigate} from "react-router-dom";

const useLogout = () => {
    const navigate = useNavigate();
    const logout = async () => {
        try {
            const response = await fetch(`${apiUrl}/logout`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if (data.success) {
                navigate('/');
            } else {
                console.error('Échec de la déconnexion :', data.error || data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion :', error);
        }
    };

    return { logout };
};

export default useLogout;