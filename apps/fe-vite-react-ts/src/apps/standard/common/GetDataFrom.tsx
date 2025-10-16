import axios from 'axios';
import { useEffect, useState } from "react";

const GetDataFrom = (
    url: string
) => {

    const [result, setResult] = useState(() => []);
    
    useEffect(
        () => {
            axios.get(url)
                .then(
                    (data) => {
                        setResult(data.data);
                    }
                )
                .catch(
                    () => {
                        console.error('GetDataFrom() error : ' + url);
                    }
                )
        }, [url]
    );
    
    return result;
    
}

export default GetDataFrom;
