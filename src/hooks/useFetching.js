import {useState} from 'react';

export const useFetching = (callback) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetching = async () => {
        try {
            setIsLoading(true)
            await callback()
        } catch (e) {
            setError(e);
        } finally {
            setIsLoading(false)
        }
    }

    // console.log(fetching)

    return [fetching, isLoading, error]
}