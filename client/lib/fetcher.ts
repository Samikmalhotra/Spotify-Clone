export default function fetcher(url: string, data = undefined): Promise<Response> {
    return fetch(`${window.location.origin}/api${url}`, {
        method: data ? 'POST' : 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
    }).then((res)=>{
        if(res.status > 399 || res.status < 200){
            throw new Error(res.statusText);
        }
        return res.json();
    })
}