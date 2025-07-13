import { useState } from 'react'
import './App.css'

function App() {
  const [score, setScore] = useState(0)
  const [wickets, setWickets] = useState(0)
  const [overs, setOvers] = useState(0)
  const [balls, setBalls] = useState(0)
  const [allOvers, setAllOvers] = useState([])
  const [currentOver, setCurrentOver] = useState([])
  const [activeTab, setActiveTab] = useState('scoreboard')
  const [actionHistory, setActionHistory] = useState([])

  const addRuns = (runs) => {
    const action = {
      type: 'runs',
      value: runs,
      previousScore: score,
      previousBalls: balls,
      previousCurrentOver: [...currentOver]
    }
    
    setActionHistory(prev => [...prev, action])
    setScore(prev => prev + runs)
    setCurrentOver(prev => [...prev, runs])
    addBall()
  }

  const addWicket = () => {
    const action = {
      type: 'wicket',
      previousWickets: wickets,
      previousBalls: balls,
      previousCurrentOver: [...currentOver]
    }
    
    setActionHistory(prev => [...prev, action])
    setWickets(prev => prev + 1)
    setCurrentOver(prev => [...prev, 'W'])
    addBall()
  }

  const addDot = () => {
    const action = {
      type: 'dot',
      previousBalls: balls,
      previousCurrentOver: [...currentOver]
    }
    
    setActionHistory(prev => [...prev, action])
    setCurrentOver(prev => [...prev, 0])
    addBall()
  }

  const addWide = () => {
    const action = {
      type: 'wide',
      previousScore: score,
      previousCurrentOver: [...currentOver]
    }
    
    setActionHistory(prev => [...prev, action])
    setScore(prev => prev + 1)
    setCurrentOver(prev => [...prev, 'WD'])
    // Wide doesn't count as a ball
  }

  const addNoBall = () => {
    const action = {
      type: 'noball',
      previousScore: score,
      previousCurrentOver: [...currentOver]
    }
    
    setActionHistory(prev => [...prev, action])
    setScore(prev => prev + 1)
    setCurrentOver(prev => [...prev, 'NB'])
    // No ball doesn't count as a ball
  }

  const addBall = () => {
    const newBalls = balls + 1
    
    if (newBalls === 6) {
      setOvers(prevOvers => prevOvers + 1)
      setAllOvers(prev => [...prev, [...currentOver]])
      setCurrentOver([])
      setBalls(0)
    } else {
      setBalls(newBalls)
    }
  }

  const resetGame = () => {
    setScore(0)
    setWickets(0)
    setOvers(0)
    setBalls(0)
    setAllOvers([])
    setCurrentOver([])
    setActionHistory([])
  }

  const undoLastAction = () => {
    if (actionHistory.length === 0) return
    
    const lastAction = actionHistory[actionHistory.length - 1]
    
    switch (lastAction.type) {
      case 'runs':
        setScore(lastAction.previousScore)
        setBalls(lastAction.previousBalls)
        setCurrentOver(lastAction.previousCurrentOver)
        break
      case 'wicket':
        setWickets(lastAction.previousWickets)
        setBalls(lastAction.previousBalls)
        setCurrentOver(lastAction.previousCurrentOver)
        break
      case 'dot':
        setBalls(lastAction.previousBalls)
        setCurrentOver(lastAction.previousCurrentOver)
        break
      case 'wide':
        setScore(lastAction.previousScore)
        setCurrentOver(lastAction.previousCurrentOver)
        break
      case 'noball':
        setScore(lastAction.previousScore)
        setCurrentOver(lastAction.previousCurrentOver)
        break
      default:
        break
    }
    
    setActionHistory(prev => prev.slice(0, -1))
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const formatOvers = () => {
    return `${overs}.${balls}`
  }

  // Count valid balls (excluding wides and no balls)
  const getValidBallsCount = () => {
    return currentOver.filter(ball => ball !== 'WD' && ball !== 'NB').length
  }

  // Get remaining valid balls needed to complete the over
  const getRemainingValidBalls = () => {
    return 6 - getValidBallsCount()
  }

  return (
    <div className="cricket-app">
      <div className="scoreboard">
        <h1>🏏 Lampton (@Cricket) Scoreboard</h1>
        
        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'scoreboard' ? 'active' : ''}`}
            onClick={() => handleTabChange('scoreboard')}
          >
            Scoreboard
          </button>
          <button 
            className={`tab ${activeTab === 'fullscoreboard' ? 'active' : ''}`}
            onClick={() => handleTabChange('fullscoreboard')}
          >
            Full Scoreboard
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'scoreboard' && (
          <>
            {/* Score Display */}
            <div className="score-card">
              <div className="score-main">
                <h2>{score}/{wickets}</h2>
                <p className="overs">Overs: {formatOvers()}</p>
              </div>
            </div>

            {/* Current Over */}
            <div className="current-over">
              <h3>Current Over</h3>
              <div className="balls">
                {currentOver.map((ball, idx) => (
                  <span key={idx} className={`ball ${ball === 'W' ? 'wicket' : ball === 0 ? 'dot' : ball === 'WD' ? 'wide' : ball === 'NB' ? 'noball' : 'run'}`}>
                    {ball === 'W' ? 'W' : ball === 0 ? '.' : ball === 'WD' ? 'WD' : ball === 'NB' ? 'NB' : ball}
                  </span>
                ))}
                {[...Array(getRemainingValidBalls())].map((_, idx) => (
                  <span key={`empty-${idx}`} className="ball empty"></span>
                ))}
              </div>
            </div>

            {/* Scoring Buttons */}
            <div className="scoring-section">
              <div className="runs-buttons">
                <h3>Runs</h3>
                <div className="button-grid">
                  <button onClick={() => addRuns(1)} className="run-btn">1</button>
                  <button onClick={() => addRuns(2)} className="run-btn">2</button>
                  <button onClick={() => addRuns(3)} className="run-btn">3</button>
                  <button onClick={() => addRuns(4)} className="run-btn">4</button>
                  <button onClick={() => addRuns(6)} className="run-btn">6</button>
                </div>
              </div>

              <div className="other-buttons">
                <h3>Other</h3>
                <div className="button-grid">
                  <button onClick={addDot} className="dot-btn">Dot</button>
                  <button onClick={addWicket} className="wicket-btn">Wicket</button>
                  <button onClick={addWide} className="wide-btn">Wide</button>
                  <button onClick={addNoBall} className="noball-btn">No Ball</button>
                  <button 
                    onClick={undoLastAction} 
                    className={`undo-btn ${actionHistory.length === 0 ? 'disabled' : ''}`}
                    disabled={actionHistory.length === 0}
                  >
                    Undo
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'fullscoreboard' && (
          <>
            {/* Score Display */}
            <div className="score-card">
              <div className="score-main">
                <h2>{score}/{wickets}</h2>
                <p className="overs">Overs: {formatOvers()}</p>
              </div>
            </div>

            {/* Over History */}
            <div className="over-history">
              <h3>Over History</h3>
              <div className="overs-container">
                {allOvers.map((over, overIndex) => (
                  <div key={overIndex} className="over-item">
                    <span className="over-number">Over {overIndex + 1}:</span>
                    <div className="over-balls">
                      {over.map((ball, ballIndex) => (
                        <span key={ballIndex} className={`ball ${ball === 'W' ? 'wicket' : ball === 0 ? 'dot' : ball === 'WD' ? 'wide' : ball === 'NB' ? 'noball' : 'run'}`}>
                          {ball === 'W' ? 'W' : ball === 0 ? '.' : ball === 'WD' ? 'WD' : ball === 'NB' ? 'NB' : ball}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="controls">
              <button onClick={resetGame} className="reset-btn">Reset Game</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
