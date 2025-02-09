# HerMap
## HerMap: Menstrual Hygiene With Ease

## Inspiration
The development of HerMap emerged from a critical need we observed at Rutgers University. Students frequently encountered uncertainty and stress when trying to access menstrual hygiene products across campus facilities. The existing process of physically checking multiple locations was not just time-consuming but also created unnecessary anxiety during already challenging moments. We envisioned creating a solution that would empower students by providing real-time information about resource availability, transforming a traditionally stressful experience into a seamless one.

## What We Learned
Through building HerMap, we gained profound insights into both technical innovation and social impact. Our journey deepened our understanding of modern web technologies, particularly in creating responsive interfaces with Google Maps API integration. We mastered MongoDB's real-time data capabilities, learning to handle concurrent updates while maintaining data consistency. Most importantly, we learned the delicate balance of designing health-related applications that prioritize both functionality and user privacy, ensuring our platform remains sensitive to users' needs while delivering essential information.

## How We Built It
We developed HerMap using a sophisticated technology stack that prioritizes real-time functionality and user experience: For the frontend, we crafted an intuitive interface using HTML5, CSS3, and JavaScript, centered around an interactive Google Maps integration. We implemented custom markers with color-coded status indicators to provide at-a-glance resource availability information. The backend infrastructure combines Node.js with Express, leveraging MongoDB's robust data persistence capabilities to handle real-time updates efficiently. We implemented WebSocket connections to ensure instantaneous synchronization of status changes across all connected clients. The most innovative aspect of our project is our AI-powered health assistant, built using Phidata's framework. This sophisticated system leverages Groq AI's powerful language processing capabilities alongside a dual-agent architecture - one agent conducts real-time web searches through DuckDuckGo while another analyzes our carefully curated PDF knowledge base using RAG (Retrieval-Augmented Generation) vector database technology.

## Challenges We Faced
Several significant challenges emerged during development:

- **Real-time Data Management**: Implementing a system that could handle concurrent updates while maintaining data consistency proved complex. We solved this by carefully designing our MongoDB schema and implementing optimistic updates.
- **Privacy Considerations**: Balancing the need for location-specific information with user privacy required thoughtful design decisions. We implemented anonymous updating and carefully controlled what information was publicly visible.
- **User Interface Design**: Creating an interface that was both informative and discreet presented unique challenges. We conducted multiple design iterations to find the right balance between functionality and sensitivity.
- **Technical Integration**: Coordinating multiple technologies - from mapping services to real-time updates to chatbot functionality - required careful architecture planning and robust error handling.

## Impact and Future Directions
HerMap has evolved into a comprehensive platform that combines resource accessibility with health education. Our AI-powered chatbot not only provides information about product availability but also offers valuable menstrual health guidance, creating a more holistic support system for students. Looking ahead, we plan to enhance HerMap by:

- Implementing predictive analytics to forecast resource depletion
- Developing a progressive web app for improved mobile access
- Expanding our AI capabilities to provide more personalized health insights
- Creating an API for seamless integration with other university systems
- Scaling our solution to benefit other educational institutions

HerMap demonstrates how innovative technology can address practical challenges while promoting health awareness and social equity in educational settings. Our platform not only solves an immediate need but also creates a foundation for broader conversations about menstrual health accessibility.

https://www.canva.com/design/DAGeoK_qwi0/g_gMYTbtSbBVNqnwiWWxOQ/view?utm_content=DAGeoK_qwi0&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hf0090173e4
