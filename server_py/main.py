import os
from typing import List, Literal, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage


load_dotenv()

PUBLIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public"))

app = FastAPI(title="ML Ecosystem (Python Server)")
app.mount("/", StaticFiles(directory=PUBLIC_DIR, html=True), name="public")


class ChatMsg(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatReq(BaseModel):
    # accept either: { "message": "..." } or { "messages": [...] }
    message: Optional[str] = None
    messages: Optional[List[ChatMsg]] = None


@app.get("/api/health")
def health():
    return {"status": "Server is running", "server": "python"}


@app.post("/api/chat")
async def chat(req: ChatReq):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is not set on the server. Add it to your environment variables.",
        )

    normalized: List[ChatMsg] = []
    if req.messages and len(req.messages) > 0:
        normalized = req.messages
    elif req.message and req.message.strip():
        normalized = [ChatMsg(role="user", content=req.message.strip())]
    else:
        raise HTTPException(status_code=400, detail="No message provided.")

    # keep short context
    trimmed = [m for m in normalized if m.content and m.content.strip()][-12:]

    system_prompt = "\n".join(
        [
            "You are an AI assistant for a Machine Learning educational website.",
            "Your goal is to help students understand concepts clearly.",
            "",
            "Instructions:",
            "- Answer in simple language",
            "- Keep answers short (3–6 lines)",
            "- Use examples when possible",
            "- If the topic is regression, include formula when needed",
            "- If the question is about coding, give small clean code snippets",
            "- If unsure, say: \"I'm not sure, but I can guide you\"",
            "",
            "Special Behavior:",
            "- Prefer clarity over complexity",
            "- Do not give very long explanations",
            "- Stay focused only on Machine Learning topics",
            "",
            "Tone:",
            "- Friendly",
            "- Teacher-like",
            "- Helpful",
        ]
    )

    lc_messages = [SystemMessage(system_prompt)]
    for m in trimmed:
        content = m.content.strip()
        if m.role == "assistant":
            lc_messages.append(AIMessage(content))
        else:
            lc_messages.append(HumanMessage(content))

    model_name = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")
    llm = ChatGroq(
        api_key=api_key,
        model=model_name,
        temperature=0.3,
        max_tokens=320,
    )

    try:
        result = await llm.ainvoke(lc_messages)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Chat failed. Check server logs.") from e

    reply = result.content if isinstance(result.content, str) else str(result.content)
    return {"reply": reply}


# Fallback to SPA-style routing like the Node server:
# unknown paths should return index.html (so deep links work).
@app.get("/{full_path:path}")
def spa_fallback(full_path: str):
    # If it's a real file under public/, StaticFiles would have served it.
    # So here we always return index.html.
    return FileResponse(os.path.join(PUBLIC_DIR, "index.html"))

