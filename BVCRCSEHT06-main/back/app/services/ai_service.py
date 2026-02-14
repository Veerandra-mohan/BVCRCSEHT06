import google.generativeai as genai
from flask import current_app
import json

class AIAnalysisService:
    """Service for AI-powered analysis using Gemini API"""
    
    def __init__(self):
        """Initialize Gemini API"""
        api_key = current_app.config.get('GEMINI_API_KEY')
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
    
    def analyze_essay(self, essay_text, student_name='Student', mode='student'):
        """Analyze essay with feedback"""
        if mode == 'student':
            prompt = f"""Analyze this essay written by {student_name} and provide constructive feedback:
            
{essay_text}

Please provide:
1. Grammar and spelling corrections
2. Structural improvements
3. Clarity and coherence suggestions
4. Tone analysis
5. Estimated grade/score (out of 100)
6. Specific improvement recommendations

Format as JSON with keys: grammar_errors, structure_feedback, clarity_feedback, tone_analysis, estimated_grade, recommendations"""
        
        elif mode == 'teacher':
            prompt = f"""As an experienced teacher, analyze this student essay and provide detailed feedback:
            
{essay_text}

Provide:
1. Subject matter accuracy
2. Argument strength
3. Evidence support
4. Writing quality
5. Grade recommendation (A-F)
6. Detailed rubric score
7. Comments for parent communication

Format as JSON with keys: accuracy, argument_strength, evidence, writing_quality, grade, rubric_scores, parent_comments"""
        
        else:  # parent mode
            prompt = f"""Analyze this essay in simple, non-technical language for a parent to understand:
            
{essay_text}

Explain:
1. What the essay is about
2. Strengths demonstrated
3. Areas for improvement
4. Simple grade/level explanation
5. How parents can help

Format as JSON with keys: summary, strengths, improvements, grade_explanation, parent_suggestions"""
        
        try:
            response = self.model.generate_content(prompt)
            # Parse JSON response
            try:
                analysis = json.loads(response.text)
            except:
                analysis = {'raw_feedback': response.text}
            return analysis
        except Exception as e:
            return {'error': str(e)}
    
    def analyze_code(self, code_text):
        """Analyze code for bugs and improvements"""
        prompt = f"""Analyze this Python code for errors, bugs, and improvements:

```python
{code_text}
```

Provide:
1. Syntax errors found
2. Logic bugs
3. Performance issues
4. Security concerns
5. Code style improvements
6. Refactoring suggestions
7. Corrected code version
8. Line-by-line explanations for errors

Format as JSON with keys: syntax_errors, logic_bugs, performance_issues, security_concerns, style_improvements, refactoring, corrected_code, explanations"""
        
        try:
            response = self.model.generate_content(prompt)
            try:
                analysis = json.loads(response.text)
            except:
                analysis = {'raw_analysis': response.text}
            return analysis
        except Exception as e:
            return {'error': str(e)}
    
    def analyze_audio(self, transcription, audio_path=None):
        """Analyze audio/speech"""
        prompt = f"""Analyze this transcribed audio for communication quality:

Transcription: {transcription}

Provide:
1. Clarity assessment
2. Grammar analysis
3. Pronunciation feedback
4. Communication effectiveness
5. Suggestions for improvement
6. Confidence level

Format as JSON with keys: clarity, grammar, pronunciation, effectiveness, suggestions, confidence"""
        
        try:
            response = self.model.generate_content(prompt)
            try:
                analysis = json.loads(response.text)
            except:
                analysis = {'transcription': transcription, 'raw_analysis': response.text}
            return analysis
        except Exception as e:
            return {'error': str(e)}
    
    def analyze_image(self, image_path, extracted_text=''):
        """Analyze image content"""
        try:
            with open(image_path, 'rb') as img_file:
                image_data = img_file.read()
            
            prompt = f"""Analyze this image. Extracted text from image: {extracted_text}

Provide:
1. Content description
2. Concepts identified
3. Potential misconceptions
4. Educational value
5. Suggested explanations

Format as JSON with keys: description, concepts, misconceptions, educational_value, explanations"""
            
            response = self.model.generate_content([prompt, {'mime_type': 'image/jpeg', 'data': image_data}])
            try:
                analysis = json.loads(response.text)
            except:
                analysis = {'extracted_text': extracted_text, 'raw_analysis': response.text}
            return analysis
        except Exception as e:
            return {'error': str(e)}
    
    def get_word_definition(self, word, context=''):
        """Get word definition with pronunciation and examples"""
        prompt = f"""Define the word "{word}". {"Context: " + context if context else ""}

Provide:
1. Definition
2. Part of speech
3. Pronunciation guide
4. Example usage
5. Synonyms
6. Etymology if interesting

Format as JSON with keys: definition, part_of_speech, pronunciation, examples, synonyms, etymology"""
        
        try:
            response = self.model.generate_content(prompt)
            try:
                definition = json.loads(response.text)
            except:
                definition = {'word': word, 'definition': response.text}
            return definition
        except Exception as e:
            return {'error': str(e)}
    
    def generate_lesson_plan(self, topic, level='beginner'):
        """Generate lesson plan"""
        prompt = f"""Create a detailed lesson plan for teaching "{topic}" at {level} level:

Include:
1. Learning objectives
2. Prerequisites
3. Content outline
4. Examples and use cases
5. Practice problems
6. Assessment methods
7. Resources needed

Format as JSON with keys: objectives, prerequisites, outline, examples, problems, assessment, resources"""
        
        try:
            response = self.model.generate_content(prompt)
            try:
                lesson = json.loads(response.text)
            except:
                lesson = {'topic': topic, 'lesson_plan': response.text}
            return lesson
        except Exception as e:
            return {'error': str(e)}
    
    def suggest_improvements(self, student_name, weak_concepts, strong_concepts):
        """Generate personalized improvement suggestions"""
        prompt = f"""Based on {student_name}'s learning profile:
        
Strong concepts: {', '.join(strong_concepts)}
Weak concepts: {', '.join(weak_concepts)}

Provide:
1. Personalized study plan
2. Resources for weak areas
3. Practice problems
4. Motivation tips
5. Learning strategy recommendations

Format as JSON with keys: study_plan, resources, practice_problems, motivation, strategy"""
        
        try:
            response = self.model.generate_content(prompt)
            try:
                suggestions = json.loads(response.text)
            except:
                suggestions = {'recommendations': response.text}
            return suggestions
        except Exception as e:
            return {'error': str(e)}
