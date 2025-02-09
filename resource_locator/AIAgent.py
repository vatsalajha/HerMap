import streamlit as st
from phi.agent import Agent
from phi.tools.duckduckgo import DuckDuckGo
from phi.knowledge.pdf import PDFUrlKnowledgeBase
from phi.vectordb.pgvector import PgVector2
from phi.embedder.sentence_transformer import SentenceTransformerEmbedder
from phi.model.groq import Groq
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database URL
db_url = os.getenv("DATABASE_URL", "postgresql+psycopg://ai:ai@localhost:5432/ai")

# Initialize the embedder
embedder = SentenceTransformerEmbedder(dimensions=384)

# Define the Web Search Agent
web_search_agent = Agent(
    name="Web Search Agent",
    role="Find up-to-date info on menstrual health from trusted sources.",
    tools=[DuckDuckGo()],
    model=Groq(id="llama-3.3-70b-versatile", embedder=embedder),
    instructions=["Find the latest and most reliable info on menstrual health, but keep it simple and easy to understand!",
                  "Summarize findings in a natural, caring, and supportive conversation."],
    show_tool_calls=False,
)

# Define the PDF Knowledge Base Agent
knowledge_base = PDFUrlKnowledgeBase(
    urls=["https://www.heygirls.co.uk/wp-content/uploads/2023/06/A5-TOTM-BOOK-.pdf",
          "https://www.ohsu.edu/sites/default/files/2024-05/Period%20Education%20Guide%20Full%20final.pdf",
          "https://www.unicef.org/media/91341/file/UNICEF-Guidance-menstrual-health-hygiene-2019.pdf"
          ],
    vector_db=PgVector2(collection="menstrual_health", db_url=db_url, embedder=embedder),
)

# knowledge_base.load(recreate=False)

pdf_agent = Agent(
    name="PDF Knowledge Base Agent",
    role="Access and extract useful menstrual health tips from trusted documents.",
    knowledge_base=knowledge_base,
    model=Groq(id="llama-3.3-70b-versatile", embedder=embedder),
    instructions=["Find the best answers from the document and keep them short, friendly, and helpful."],
    show_tool_calls=False,
)

# Create the Agent Team with a Casual Tone
menstrual_health_agent_team = Agent(
    name="Menstrual Health Buddy",
    team=[web_search_agent, pdf_agent],
    model=Groq(id="llama-3.3-70b-versatile", embedder=embedder),
    instructions=[
    "First, check the PDF knowledge base for relevant menstrual health information.",
    "Search the web for the latest trusted sources.",
    "Blend information from both sources into a **natural, caring response**—like a big sister talking to you.",
    "Use a **warm, friendly, and supportive tone** without sounding overly technical or robotic.",
    "Explain things **clearly and naturally**, like you’re chatting with someone who trusts you for advice.",
    "If the topic involves discomfort or emotions, be **gentle, reassuring, and understanding**.",
    "Always **validate the user’s feelings** and let them know they’re not alone.",
    "Avoid medical jargon—keep it real, **practical, and easy to understand**.",
    "Encourage self-care and body positivity where relevant, reminding them to prioritize their well-being.",
    "Also keep it short, friendly, and helpful."
    ],
    show_tool_calls=False,
)

# Streamlit User Interface
st.title("🌸 HerMap: Your Menstrual Health Companion")

# Chatbot greeting
st.markdown("### 👋 Find resources, access support, and stay informed—all in one place. Real-time updates, AI-powered advice, and an intuitive map make managing menstrual health easier than ever. 💕")

#Query Input
user_query = st.text_input("What's on your mind? 💭")
if st.button("Get Advice 💡"):
    if not user_query:
        st.warning("Oops! Looks like you forgot to type something. Try again! 😊")
    else:
        response = menstrual_health_agent_team.run(user_query)
        st.write(response.content)