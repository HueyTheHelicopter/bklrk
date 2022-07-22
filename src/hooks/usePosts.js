import { useMemo } from 'react';

export const usePosts = (cameras, sort) => {
    const sortedData = useMemo(() => {
        if (sort) {
          return [...cameras].sort((a, b) => a[sort] - b[sort])
        }
        return cameras; 
    }, [sort, cameras])
    console.log(sort)
    return sortedData;
}

export default usePosts;