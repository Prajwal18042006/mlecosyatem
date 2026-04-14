import os
import streamlit as st
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


def get_llm() -> ChatGroq:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        st.error("Missing GROQ_API_KEY. Add it to your .env file.")
        st.stop()
    model = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")
    return ChatGroq(api_key=api_key, model=model, temperature=0.3, max_tokens=320)


def main() -> None:
    load_dotenv()
    st.set_page_config(page_title="ML Tutor Bot (Python)", layout="centered")
    st.title("ML Tutor Bot")
    st.caption("Short answers • ML only • Powered by LangChain + Groq")

    llm = get_llm()

    if "messages" not in st.session_state:
        st.session_state.messages = [SystemMessage(SYSTEM_PROMPT)]
        st.session_state.ui = [
            ("assistant", "Ask me any Machine Learning question.\nI will answer in 3–6 short lines.")
        ]

    for role, content in st.session_state.ui:
        with st.chat_message(role):
            st.write(content)

    prompt = st.chat_input("Ask a Machine Learning question…")
    if prompt:
        st.session_state.messages.append(HumanMessage(prompt))
        st.session_state.ui.append(("user", prompt))

        with st.chat_message("assistant"):
            with st.spinner("Thinking…"):
                trimmed = [st.session_state.messages[0]] + st.session_state.messages[-12:]
                result = llm.invoke(trimmed)
                text = result.content if isinstance(result.content, str) else str(result.content)
                st.write(text)

        st.session_state.messages.append(AIMessage(text))
        st.session_state.ui.append(("assistant", text))


if __name__ == "__main__":
    main()

