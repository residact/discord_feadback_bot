import axios, {AxiosResponse} from 'axios';

export async function isApiUp(): Promise<boolean> {
    try {
        const response = await axios.get(`${process.env.LLAMA_API}/models`);
        return response.status === 200;
    } catch (e) {
        return false;
    }
}

export async function getCompletions(data: { messages: any[] }): Promise<AxiosResponse> {
    return await axios.post(`${process.env.LLAMA_API}/chat/completions`, data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    });
}
