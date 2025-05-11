import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { getVertexAI, getGenerativeModel } from 'firebase/vertexai';
import { environment } from '../../environment';


@Injectable({
  providedIn: 'root'
})
export class VertexAiService {
  private model: any;

  constructor() {
    const app = initializeApp(environment.firebase);
    const vertexAI = getVertexAI(app);
    this.model = getGenerativeModel(vertexAI, { model: 'gemini-2.0-flash' });
  }

  suggestFindingNotes(title: string, description: string): Observable<string> {
    const prompt = this.buildDetailedPrompt(title, description);

    const resultPromise: Promise<string> = this.model.generateContent(prompt).then((result: any) => {
      return result?.response?.text() ?? 'No suggestion received.';
    });

    return from(resultPromise);
  }

  private buildDetailedPrompt(title: string, description: string): string {
    return `
As an experienced software auditor, you are assisting in analyzing findings from a structured audit process.

A particular issue has been identified during the review of a software system or component.
You are provided with a title and description of this finding. Your role is to examine the problem,
consider its implications (e.g., quality, maintainability, performance, security),
and recommend a clear, actionable resolution.

Also, consider:
- Root cause of the issue
- Potential impact if left unaddressed
- Steps to fix the issue and prevent its recurrence
- Any relevant tools, best practices, or documentation

Please structure your answer as a single, concise paragraph starting with: "Recommendation:"
Avoid vague language; instead, be specific and practical.

---

Finding Title: ${title}
Finding Description: ${description}

---

Recommendation:
`.trim();
  }
}
