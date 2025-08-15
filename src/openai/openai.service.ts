import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API Error Details:', {
        message: error.message,
        status: error.status,
        type: error.type,
        code: error.code,
      });
      throw new Error(`Failed to generate text with OpenAI: ${error.message}`);
    }
  }

  async analyzeNote(content: string): Promise<string> {
    const prompt = `다음 노트 내용을 분석하고 요약해주세요: ${content}`;
    return this.generateText(prompt);
  }

  async generateTodoSuggestion(context: string): Promise<string> {
    const prompt = `다음 컨텍스트를 바탕으로 할 일 제안을 생성해주세요: ${context}`;
    return this.generateText(prompt);
  }

  async summarizeAndOrganizeNote(content: string): Promise<string> {
    const prompt = `다음 노트 내용을 요약하고 보기 좋게, 가독성 있게 정리해줘, textarea에 담길 내용이라 일반 텍스트로 작성해줘: ${content}`;
    return this.generateText(prompt);
  }
}
