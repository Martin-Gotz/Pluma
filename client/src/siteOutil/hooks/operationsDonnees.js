import { useState, useEffect } from 'react';
import apiUrl from "../../config";

const UseFetchData = (url, isSingleRecord = false) => {
    const [data, setData] = useState(isSingleRecord ? null : []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const result = await response.json();

                setData(isSingleRecord ? result.data[0] : result.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, isSingleRecord]);

    return { data, loading, error };
};

const deleteData = async (url) => {
    try {
        await fetch(url, {method: 'DELETE'});
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'élément :', error);
    }
}

const modifierProjet = async (id, colonne, valeur) => {
    fetch(`${apiUrl}/modifier-projet/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ colonne: colonne, valeur: valeur}),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('La requête a échoué');
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Erreur lors de la modification:', error);
        });
}

const creerNouveauProjet = async (titre) => {
    try {
        const response = await fetch(`${apiUrl}/creer-projet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ titre: titre }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('La requête a échoué');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la création du projet:', error);
    }
};

const modifier = async (id, table, colonne, valeur) => {
    fetch(`${apiUrl}/modifier-chapitre/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ table: table, colonne: colonne, valeur: valeur}),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('La requête a échoué');
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Erreur lors de la modification:', error);
        });
}

export { UseFetchData, deleteData, modifierProjet, creerNouveauProjet, modifier };