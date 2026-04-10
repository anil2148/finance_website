import { NextRequest, NextResponse } from 'next/server';
import { buildCopilotResponse } from '@/lib/money-copilot/output';
import type { CopilotRequest } from '@/lib/money-copilot/types';

export async function POST(req: NextRequest) {
  try {
    const body: CopilotRequest = await req.json();

    if (!body.question || body.question.trim().length === 0) {
      return NextResponse.json({ error: 'Question is required.' }, { status: 400 });
    }

    if (!body.mode) {
      return NextResponse.json({ error: 'Decision mode is required.' }, { status: 400 });
    }

    const response = buildCopilotResponse({
      mode: body.mode,
      question: body.question.trim(),
      inputs: body.inputs ?? {},
      scenarios: body.scenarios ?? []
    });

    return NextResponse.json(response);
  } catch (err) {
    console.error('[money-copilot] Error:', err);
    return NextResponse.json({ error: 'Failed to process request. Please try again.' }, { status: 500 });
  }
}
