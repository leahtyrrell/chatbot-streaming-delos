import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getThemeById } from '@/utils/prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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',
});

export async function POST(request: NextRequest) {
  try {
    const { message, themeId, conversationHistory = [] } = await request.json();

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Get theme configuration
    const theme = getThemeById(themeId);
    if (!theme) {
      return NextResponse.json(
        { error: 'Invalid theme ID' },
        { status: 400 }
      );
    }

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system' as const, content: theme.systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user' as const, content: message }
    ];

    // Create streaming response
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      stream: true,
      max_tokens: 500,
      temperature: 0.7,
    });

    // Create a readable stream
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              const data = JSON.stringify({ content, finished: false });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          
          // Send final message
          const finalData = JSON.stringify({ content: '', finished: true });
          controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}