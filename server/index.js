require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { ChatGroq } = require('@langchain/groq');
const { HumanMessage, AIMessage, SystemMessage } = require('@langchain/core/messages');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Database connection (Optional placeholder)
// const connectDB = require('./config/database');
// connectDB();

// Basic API routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date() });
});

app.post('/api/chat', async (req, res) => {
    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({
                error: 'GROQ_API_KEY is not set on the server. Add it to your environment variables.',
            });
        }

        const body = req.body || {};
        const rawMessages = Array.isArray(body.messages) ? body.messages : [];
        const userMessage = typeof body.message === 'string' ? body.message : '';

        // Accept either {message} or {messages}
        const normalized = rawMessages.length
            ? rawMessages
            : userMessage
              ? [{ role: 'user', content: userMessage }]
              : [];

        const trimmed = normalized
            .map((m) => ({
                role: m?.role === 'assistant' ? 'assistant' : 'user',
                content: typeof m?.content === 'string' ? m.content.trim() : '',
            }))
            .filter((m) => m.content.length > 0)
            .slice(-12); // keep it small

        if (trimmed.length === 0) {
            return res.status(400).json({ error: 'No message provided.' });
        }

        const systemPrompt = [
            'You are an AI assistant for a Machine Learning educational website.',
            'Your goal is to help students understand concepts clearly.',
            '',
            'Instructions:',
            '- Answer in simple language',
            '- Keep answers short (3–6 lines)',
            '- Use examples when possible',
            '- If the topic is regression, include formula when needed',
            '- If the question is about coding, give small clean code snippets',
            '- If unsure, say: "I\'m not sure, but I can guide you"',
            '',
            'Special Behavior:',
            '- Prefer clarity over complexity',
            '- Do not give very long explanations',
            '- Stay focused only on Machine Learning topics',
            '',
            'Tone:',
            '- Friendly',
            '- Teacher-like',
            '- Helpful',
        ].join('\n');

        const lcMessages = [new SystemMessage(systemPrompt)];
        for (const m of trimmed) {
            lcMessages.push(m.role === 'assistant' ? new AIMessage(m.content) : new HumanMessage(m.content));
        }

        const model = new ChatGroq({
            apiKey,
            model: process.env.GROQ_MODEL || 'llama-3.1-70b-versatile',
            temperature: 0.3,
            maxTokens: 320,
        });

        const result = await model.invoke(lcMessages);
        const text = typeof result?.content === 'string' ? result.content : String(result?.content ?? '');

        res.json({
            reply: text,
        });
    } catch (err) {
        console.error('Chat error:', err);
        res.status(500).json({ error: 'Chat failed. Check server logs.' });
    }
});

// Handle API 404s
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

// Serve the main entry point for all other routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
