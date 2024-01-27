import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
})

export const runtime = 'edge'

export async function POST(req: Request) {
    const { messages } = await req.json()
    console.log("messages", messages);

    const response = await openai.chat.completions.create({
        messages: [
            // { "role": "system", "content": "You are a helpful assistant." },
            { "role": "user", "content": messages },
            // { "role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020." },
            // { "role": "user", "content": "Where was it played?" }
        ],
        model: "gpt-3.5-turbo",
    })


    return Response.json(response.choices[0].message)
}