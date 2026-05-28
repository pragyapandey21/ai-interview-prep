const renderPage = () => {
    const topicCompleted = completedQuestions[selectedTopic] || [];

    // 1. Dashboard View
    if (activePage === "Dashboard") {
      return (
        <div className="dashboard-page">
          <div className="welcome-card">
            <h1>Welcome back, Pragya 👋</h1>
            <p>Ready to improve your interview skills today?</p>
          </div>

          <div className="quick-actions">
            <button onClick={() => setActivePage("Topics")}>Continue Learning</button>
            <button onClick={() => setActivePage("MockInterview")}>Take Mock Interview</button>
            <button onClick={() => setActivePage("Practice")}>Daily Challenge</button>
          </div>

          {/* ... keeping your remaining stats-grid and recommended-section ... */}
        </div>
      );
    }

    // 2. Topics Selection View
    if (activePage === "Topics") {
      const filteredTopics = TOPICS_DATA.filter((topic) =>
        topic.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
        <div className="topics-page">
          <h1>Interview Topics</h1>
          <div className="topics-grid">
            {filteredTopics.map((topic, index) => (
              <div className="topic-card" key={index}>
                <h2>{topic.title}</h2>
                <p>{topic.desc}</p>
                <span>Progress: {topic.progress}</span>
                <button onClick={() => { setSelectedTopic(topic.title); setActivePage("TopicDetail"); }}>
                  Start Learning
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 3. Isolated Topic Detail View (Fixed Scope)
    if (activePage === "TopicDetail") {
      const questions = TOPIC_QUESTIONS[selectedTopic] || [];
      const filteredQuestions = questions.filter((q) => {
        const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = difficultyFilter === "All" || q.difficulty === difficultyFilter;
        return matchesSearch && matchesDifficulty;
      });

      return (
        <div className="topic-detail-page">
          <div className="detail-header">
            <h1>{selectedTopic}</h1>
            <button className="back-btn" onClick={() => setActivePage("Topics")}>← Back to Topics</button>
          </div>

          <div className="detail-grid">
            {/* Notes, AI Box, and Question Lists Render Here */}
            {/* ... keeping your question mapping logic ... */}
          </div>
        </div>
      );
    }

    // 4. Mock Interview Room (Now completely decoupled and fixing your blank page!)
    if (activePage === "MockInterview") {
      return (
        <div className="mock-page">
          <h1>🎤 Live AI Mock Interview Mode</h1>
          <p>Practice dynamic interview questions under real-time conditions.</p>
          
          <div className="mock-card">
            <h2>Ready to begin your session?</h2>
            <p>The system will generate target questions based on your history. You will have a 30-second timer per concept response.</p>
            <button className="start-mock-btn" onClick={() => alert("Starting simulation...")}>
              Start Interview Simulation
            </button>
          </div>
        </div>
      );
    }

    // 5. Fallbacks for remaining layout routes
    if (activePage === "Practice") { /* ... Practice UI Component ... */ }
    if (activePage === "Feedback") { /* ... Feedback UI Component ... */ }
    if (activePage === "Progress") { /* ... Progress UI Component ... */ }
    if (activePage === "Profile") { /* ... Profile UI Component ... */ }
  };