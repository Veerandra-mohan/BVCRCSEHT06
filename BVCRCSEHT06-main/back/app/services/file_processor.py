import os
import PyPDF2
import docx
from PIL import Image
import pytesseract
import librosa
import speech_recognition as sr
import pyttsx3
from flask import current_app

class FileProcessor:
    """File processing and extraction service"""
    
    def __init__(self):
        """Initialize file processor"""
        self.upload_folder = current_app.config['UPLOAD_FOLDER']
    
    def extract_text(self, file_path):
        """Extract text from various file types"""
        _, ext = os.path.splitext(file_path)
        ext = ext.lower()
        
        if ext == '.pdf':
            return self.extract_pdf_text(file_path)
        elif ext == '.docx':
            return self.extract_docx_text(file_path)
        elif ext == '.txt':
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        else:
            return None
    
    def extract_pdf_text(self, pdf_path):
        """Extract text from PDF"""
        text = ""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text()
            return text
        except Exception as e:
            raise Exception(f"PDF extraction error: {str(e)}")
    
    def extract_pdf_content(self, pdf_path):
        """Extract PDF content with metadata"""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                num_pages = len(pdf_reader.pages)
                
                pages_content = []
                for page_num, page in enumerate(pdf_reader.pages):
                    text = page.extract_text()
                    pages_content.append({
                        'page_number': page_num + 1,
                        'text': text,
                        'word_count': len(text.split())
                    })
                
                return {
                    'total_pages': num_pages,
                    'pages': pages_content,
                    'file_path': pdf_path
                }
        except Exception as e:
            raise Exception(f"PDF processing error: {str(e)}")
    
    def extract_docx_text(self, docx_path):
        """Extract text from DOCX"""
        try:
            doc = docx.Document(docx_path)
            text = ""
            for para in doc.paragraphs:
                text += para.text + "\n"
            return text
        except Exception as e:
            raise Exception(f"DOCX extraction error: {str(e)}")
    
    def ocr_image(self, image_path):
        """Extract text from image using OCR"""
        try:
            image = Image.open(image_path)
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            raise Exception(f"OCR error: {str(e)}")
    
    def speech_to_text(self, audio_path):
        """Convert audio to text"""
        try:
            recognizer = sr.Recognizer()
            with sr.AudioFile(audio_path) as source:
                audio = recognizer.record(source)
            
            text = recognizer.recognize_google(audio)
            return text
        except Exception as e:
            # Fallback: Try with librosa
            try:
                y, sr_rate = librosa.load(audio_path)
                return f"Audio loaded: {len(y)} samples at {sr_rate}Hz"
            except:
                raise Exception(f"Speech-to-text error: {str(e)}")
    
    def text_to_speech(self, text, output_path=None):
        """Convert text to speech"""
        try:
            engine = pyttsx3.init()
            engine.setProperty('rate', 150)
            
            if output_path:
                engine.save_to_file(text, output_path)
                engine.runAndWait()
                return output_path
            else:
                engine.say(text)
                engine.runAndWait()
                return True
        except Exception as e:
            raise Exception(f"Text-to-speech error: {str(e)}")
    
    def get_file_metadata(self, file_path):
        """Get file metadata"""
        try:
            file_stat = os.stat(file_path)
            _, ext = os.path.splitext(file_path)
            
            metadata = {
                'filename': os.path.basename(file_path),
                'file_type': ext.lower(),
                'file_size': file_stat.st_size,
                'created_time': file_stat.st_ctime,
                'modified_time': file_stat.st_mtime
            }
            
            return metadata
        except Exception as e:
            raise Exception(f"Metadata extraction error: {str(e)}")
    
    def cleanup_old_files(self, max_age_seconds=86400):
        """Clean up old temporary files (default 24 hours)"""
        import time
        current_time = time.time()
        
        try:
            for filename in os.listdir(self.upload_folder):
                file_path = os.path.join(self.upload_folder, filename)
                
                if os.path.isfile(file_path):
                    file_age = current_time - os.path.getmtime(file_path)
                    
                    if file_age > max_age_seconds:
                        os.remove(file_path)
            
            return True
        except Exception as e:
            raise Exception(f"Cleanup error: {str(e)}")
