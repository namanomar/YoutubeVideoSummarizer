from youtube_transcript_api import YouTubeTranscriptApi

from dotenv import load_dotenv
import google.generativeai as genai
import os
from flask import Flask, jsonify, request 
from flask_cors import CORS


load_dotenv()

genai.configure(api_key=os.getenv("API_KEY"))

prompt="""
You are Youtube video summerizer . 
You will take the transcript text and summarizing the entire video and providing the important summary in points within 250 words.
Here is transcript text :
"""

def generate_gemini_content(transcript,prompt):

    model=genai.GenerativeModel("gemini-pro")
    response=model.generate_content(prompt+transcript)
    return response.text
    

def extract_transcript_details(youtube_video_url):
    try:
        viedo_id=youtube_video_url.split("=")[1]
        transcript=YouTubeTranscriptApi.get_transcript(viedo_id)

        transcript_text=""
        for i in transcript:
            transcript_text+=" " + i["text"]

        return transcript_text

    except Exception as e:
        raise e

app = Flask(__name__) 
CORS(app)


@app.route('/', methods =['GET'])
def root():
    if(request.method == 'GET'): 
        data="App is running"
        return jsonify({'status': data}),200

@app.route('/getcontent', methods = ['GET']) 
def home(): 
    if(request.method == 'GET'): 
        url = request.args.get("youtubeLink")
        print(url)
        transcript_text=extract_transcript_details(url)
        try: 
            if transcript_text :
                summary=generate_gemini_content(transcript=transcript_text,prompt=prompt)
        except Exception as e:
            return jsonify({'err':e}),400

        return jsonify({'data': summary}),200







app.run()



