# LLM-Powered Knowledge Assistant
 
## Overview
 
This project implements a Retrieval-Augmented Generation (RAG) system for healthcare document intelligence. The system answers questions strictly based on uploaded WHO healthcare guideline PDFs and safely refuses out-of-domain queries.
 
The architecture includes hybrid retrieval, re-ranking, semantic validation, evaluation metrics, and latency tracking.
 
---
 
## Architecture
 
User Query  
→ Hybrid Retrieval (FAISS + BM25)  
→ Cross-Encoder Re-Ranking  
→ Context Builder  
→ LLM (Mistral via Ollama)  
→ Semantic Guardrail Validation  
→ Response with Confidence and Latency  
 
---
 
## Key Features
 
- Hybrid semantic and keyword retrieval
- Cross-encoder re-ranking for improved precision
- Semantic guardrail for hallucination control
- Domain restriction and refusal handling
- Confidence score calculation
- Latency monitoring
- Evaluation framework for measurable performance
 
---
 
## Tech Stack
 
- Python 3.11
- LangChain
- FAISS (Vector Store)
- Rank-BM25
- SentenceTransformers
- CrossEncoder (MS-MARCO)
- Streamlit
- Ollama (Mistral LLM)
 
---
 
## Installation
 
Clone the repository:
 
```bash
git clone https://github.com/Rahul5103/LLM-knowledge-assistant-rag.git
cd rag-knowledge-assistant
 
Create a virtual environment:
python -m venv ragvenv
 
Activate environment:
 
Windows:
ragvenv\Scripts\activate
 
Mac/Linux:
source ragvenv/bin/activate
 
Install dependencies:
pip install -r requirements.txt
 
Add Documents
Place healthcare guideline PDFs inside the following folder:
data/
 
Then build the vector store:
python ingest.py
 
You should see:
Vector store created successfully.
 
Run Application
Ensure Ollama is running locally:
ollama run mistral
 
Then start the application:
streamlit run app.py
 
Open in browser:
http://localhost:8501
 
Run Evaluation
To measure performance:
python evaluator.py
 
This will output:
Answer accuracy
Refusal accuracy
Average latency
 
Example Output
Answer:
First-line therapy includes ACE inhibitors, ARBs, CCBs, or thiazide-like agents.
Target BP: <140/90 mmHg (<130 mmHg for high-risk patients).
Monthly follow-up after initiation.
 
Confidence Score: 0.78
Latency: 8.42 seconds
 
Project Goals
This project demonstrates:
Advanced RAG architecture design
Reliable LLM grounding techniques
Measurable evaluation framework
Hybrid retrieval engineering
Latency optimization strategies
GitHub - Rahul5103/LLM-knowledge-assistant-rag
Contribute to Rahul5103/LLM-knowledge-assistant-rag development by creating an account on GitHub.
 