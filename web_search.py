from phi.agent import Agent, RunResponse
# from phi.model.deepseek import DeepSeekChat
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.yfinance import YFinanceTools
from phi.model.ollama import Ollama

finance_agent = Agent(
    name="Finance Agent",
    # model=DeepSeekChat(),
    model=Ollama(id="deepseek-r1:1.5b"),
    tools=[YFinanceTools(stock_price=True, analyst_recommendations=True, company_info=True, company_news=True)],
    instructions=["Use tables to display data"],
    show_tool_calls=True,
    markdown=True,
)
finance_agent.print_response("Tell NVDA stock price", stream=True)

# web_agent = Agent(
#     name="Web Agent",
#     model=OpenAIChat(id="gpt-4o"),
#     tools=[YFinanceTools()],
#     instructions=["Always include sources"],
#     show_tool_calls=True,
#     markdown=True,
# )
# web_agent.print_response("Tell me about OpenAI Sora?", stream=True)
