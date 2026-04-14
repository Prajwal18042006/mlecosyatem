import os
from typing import List, Dict

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage


SYSTEM_PROMPT = "\n".join(
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


def build_llm() -> ChatGroq:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is missing. Put it in your .env file.")
    model = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")
    return ChatGroq(api_key=api_key, model=model, temperature=0.3, max_tokens=320)


def main() -> None:
    load_dotenv()
    llm = build_llm()

    history: List = [SystemMessage(SYSTEM_PROMPT)]

    print("ML Tutor Bot (Python CLI)")
    print("Type 'exit' to quit.\n")

    while True:
        user = input("You: ").strip()
        if not user:
            continue
        if user.lower() in {"exit", "quit"}:
            break

        history.append(HumanMessage(user))
        # keep last few turns (plus system)
        trimmed = [history[0]] + history[-12:]

        reply = llm.invoke(trimmed)
        text = reply.content if isinstance(reply.content, str) else str(reply.content)
        history.append(AIMessage(text))

        print("\nBot:")
        print(text)
        print()


if __name__ == "__main__":
    main()

