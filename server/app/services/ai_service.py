import json
import httpx

from app.config import settings


async def stream_chat(system_prompt: str, messages: list[dict]):
    """Stream chat completion from LLM API, yielding SSE tokens."""
    headers = {
        "Authorization": f"Bearer {settings.llm_api_key}",
        "Content-Type": "application/json",
    }
    all_messages = []
    if system_prompt:
        all_messages.append({"role": "system", "content": system_prompt})
    all_messages.extend(messages)

    payload = {
        "model": settings.llm_model,
        "messages": all_messages,
        "stream": True,
    }

    async with httpx.AsyncClient(base_url=settings.llm_api_base) as client:
        async with client.stream("POST", "/chat/completions", json=payload, headers=headers, timeout=60.0) as resp:
            async for line in resp.aiter_lines():
                if line.startswith("data: "):
                    data = line[6:]
                    if data.strip() == "[DONE]":
                        yield "data: [DONE]\n\n"
                        return
                    try:
                        chunk = json.loads(data)
                        token = chunk.get("choices", [{}])[0].get("delta", {}).get("content", "")
                        if token:
                            yield f"data: {json.dumps({'token': token})}\n\n"
                    except json.JSONDecodeError:
                        continue


async def generate_exercise(system_prompt: str, lesson_content: str, difficulty: str) -> str:
    """Generate exercise questions via LLM API (non-streaming)."""
    headers = {
        "Authorization": f"Bearer {settings.llm_api_key}",
        "Content-Type": "application/json",
    }
    prompt = f"""Based on the following lesson content, generate 3 multiple-choice exercise questions at {difficulty} difficulty.
Each question should have 4 options with exactly one correct answer.
Return as JSON array with format: [{{"question": "...", "options": [{{"text": "...", "is_correct": true/false}}], "explanation": "..."}}]

Lesson content:
{lesson_content}

System context: {system_prompt or 'General tutoring'}"""

    payload = {
        "model": settings.llm_model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
    }

    async with httpx.AsyncClient(base_url=settings.llm_api_base) as client:
        resp = await client.post("/chat/completions", json=payload, headers=headers, timeout=60.0)
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]
