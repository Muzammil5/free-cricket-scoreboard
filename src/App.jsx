import { useState } from 'react'
import './App.css'

function App() {
  const [score, setScore] = useState(0)
  const [wickets, setWickets] = useState(0)
  const [overs, setOvers] = useState(0)
  const [balls, setBalls] = useState(0)
  const [extras, setExtras] = useState(0)
  const [ballsHistory, setBallsHistory] = useState([]) // New: track each ball
  const [activeTab, setActiveTab] = useState('current') // New: tab state
  const [batsman1, setBatsman1] = useState('')
  const [batsman2, setBatsman2] = useState('')
  const [bowler, setBowler] = useState('')
  const [showPlayerModal, setShowPlayerModal] = useState(true) // New: modal state
  const [batsman1Runs, setBatsman1Runs] = useState(0) // Individual runs
  const [batsman2Runs, setBatsman2Runs] = useState(0) // Individual runs
  const [currentStriker, setCurrentStriker] = useState(1) // 1 for batsman1, 2 for batsman2
  const [showWicketModal, setShowWicketModal] = useState(false) // New: wicket modal state
  const [nextBatsman, setNextBatsman] = useState('') // New: next batsman name
  const [wicketBatsman, setWicketBatsman] = useState('') // New: which batsman got out
  const [outBatsmen, setOutBatsmen] = useState([]) // New: track out batsmen

  const handleRun = (runs) => {
    console.log('handleRun called with runs:', runs)
    setScore(prev => prev + runs)
    
    // Get current batsman name before any rotation
    const currentBatsmanName = currentStriker === 1 ? batsman1 : batsman2
    
    // Add runs to current striker
    if (currentStriker === 1) {
      setBatsman1Runs(prev => prev + runs)
    } else {
      setBatsman2Runs(prev => prev + runs)
    }
    
    // Rotate striker for odd runs (1, 3, 5) - do this after adding ball to history
    if (runs % 2 === 1) {
      setCurrentStriker(prev => prev === 1 ? 2 : 1)
    }
    
    // Update ball count first, then add to history
    setBalls(prev => {
      console.log('setBalls callback, prev:', prev, 'runs:', runs)
      const newBalls = prev + 1
      if (prev === 5) {
        // After 6 balls (0-5), increment over and change striker
        setOvers(prevOvers => prevOvers + 1)
        setCurrentStriker(prev => prev === 1 ? 2 : 1)
        // Add ball to history with the new over number
        setBallsHistory(history => {
          console.log('Adding ball to history (over end):', { over: overs + 1, ball: prev, result: runs, batsman: currentBatsmanName })
          return [...history, { 
            over: overs + 1, 
            ball: prev, 
            result: runs,
            batsman: currentBatsmanName 
          }]
        })
        return 0
      } else {
        // Add ball to history with current over number
        setBallsHistory(history => {
          console.log('Adding ball to history (normal):', { over: overs, ball: prev, result: runs, batsman: currentBatsmanName })
          return [...history, { 
            over: overs, 
            ball: prev, 
            result: runs,
            batsman: currentBatsmanName 
          }]
        })
        return newBalls
      }
    })
  }

  const handleExtra = (type) => {
    setScore(prev => prev + 1) // Extra run
    setExtras(prev => prev + 1)
    // Wide and No Ball do not count as a ball, so don't add to history
    return
  }

  const handleWicket = () => {
    setWickets(prev => prev + 1)
    
    // Determine which batsman got out
    const outBatsman = currentStriker === 1 ? batsman1 : batsman2
    const outBatsmanRuns = currentStriker === 1 ? batsman1Runs : batsman2Runs
    
    setWicketBatsman(outBatsman)
    
    // Add to out batsmen list
    setOutBatsmen(prev => [...prev, {
      name: outBatsman,
      runs: outBatsmanRuns,
      balls: getBatsmanBallsCount(outBatsman),
      ballDetails: getCurrentBatsmanBallDetails(outBatsman)
    }])
    
    // Show wicket modal
    setShowWicketModal(true)
    
    setBalls(prev => {
      const newBalls = prev + 1
      if (prev === 5) {
        // After 6 balls (0-5), increment over and change striker
        setOvers(prevOvers => prevOvers + 1)
        setCurrentStriker(prev => prev === 1 ? 2 : 1)
        // Add ball to history with the new over number
        setBallsHistory(history => [...history, { 
          over: overs + 1, 
          ball: prev, 
          result: 'W',
          batsman: outBatsman 
        }])
        return 0
      } else {
        // Add ball to history with current over number
        setBallsHistory(history => [...history, { 
          over: overs, 
          ball: prev, 
          result: 'W',
          batsman: outBatsman 
        }])
        return newBalls
      }
    })
  }

  // Helper to get balls faced by a batsman
  const getBatsmanBalls = (batsmanNumber) => {
    let balls = 0
    let currentStrikerInOver = 1

    ballsHistory.forEach((ball) => {
      if (ball.result !== 'Wd' && ball.result !== 'Nb') {
        if (currentStrikerInOver === batsmanNumber) {
          balls++
        }
      }
      
      // Rotate striker for odd runs
      if (ball.result % 2 === 1) {
        currentStrikerInOver = currentStrikerInOver === 1 ? 2 : 1
      }
    })

    return balls
  }

  const handleDot = () => {
    const currentBatsmanName = currentStriker === 1 ? batsman1 : batsman2
    
    setBalls(prev => {
      const newBalls = prev + 1
      if (prev === 5) {
        // After 6 balls (0-5), increment over and change striker
        setOvers(prevOvers => prevOvers + 1)
        setCurrentStriker(prev => prev === 1 ? 2 : 1)
        // Add ball to history with the new over number
        setBallsHistory(history => [...history, { 
          over: overs + 1, 
          ball: prev, 
          result: 0,
          batsman: currentBatsmanName 
        }])
        return 0
      } else {
        // Add ball to history with current over number
        setBallsHistory(history => [...history, { 
          over: overs, 
          ball: prev, 
          result: 0,
          batsman: currentBatsmanName 
        }])
        return newBalls
      }
    })
  }

  const resetMatch = () => {
    setScore(0)
    setWickets(0)
    setOvers(0)
    setBalls(0)
    setExtras(0)
    setBallsHistory([])
    setBatsman1Runs(0)
    setBatsman2Runs(0)
    setCurrentStriker(1)
    setShowWicketModal(false)
    setNextBatsman('')
    setWicketBatsman('')
    setOutBatsmen([]) // Clear out batsmen
    // Clear player names and show modal for new match
    setBatsman1('')
    setBatsman2('')
    setBowler('')
    setShowPlayerModal(true)
  }

  const formatOvers = () => {
    return `${overs}.${balls}`
  }

  // Get current over balls
  const getCurrentOverBalls = () => {
    return ballsHistory.filter(ball => ball.over === overs)
  }

  // Group balls by over for scorecard
  const getOversArray = () => {
    const oversArr = []
    let currentOver = []
    let currentOverNum = 0
    ballsHistory.forEach((ball, idx) => {
      if (ball.over !== currentOverNum) {
        if (currentOver.length > 0) oversArr.push(currentOver)
        currentOver = []
        currentOverNum = ball.over
      }
      currentOver.push(ball.result)
    })
    if (currentOver.length > 0) oversArr.push(currentOver)
    return oversArr
  }

  // Get current batsman ball details (for new batsmen)
  const getCurrentBatsmanBallDetails = (batsmanName) => {
    return ballsHistory
      .filter(ball => ball.batsman === batsmanName && ball.result !== 'Wd' && ball.result !== 'Nb')
      .map(ball => ball.result === 0 ? 'dot' : ball.result)
  }

  // Get balls count for a batsman
  const getBatsmanBallsCount = (batsmanName) => {
    return ballsHistory.filter(ball => 
      ball.batsman === batsmanName && 
      ball.result !== 'Wd' && 
      ball.result !== 'Nb'
    ).length
  }

  const handleStartMatch = () => {
    if (batsman1.trim() && batsman2.trim()) {
      setShowPlayerModal(false)
    }
  }

  const handleEditPlayers = () => {
    setShowPlayerModal(true)
  }

  const handleWicketReplacement = () => {
    if (nextBatsman.trim()) {
      // Replace the out batsman with new batsman
      if (currentStriker === 1) {
        setBatsman1(nextBatsman)
        setBatsman1Runs(0)
      } else {
        setBatsman2(nextBatsman)
        setBatsman2Runs(0)
      }
      
      setNextBatsman('')
      setWicketBatsman('')
      setShowWicketModal(false)
    }
  }

  return (
    <div className="cricket-scoreboard">
      {/* Player Names Modal */}
      {showPlayerModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Enter Player Names</h2>
            <p>Please enter the names of the batsmen to start the match.</p>
            
            <div className="modal-input-group">
              <label>Batsman 1:</label>
              <input 
                type="text" 
                value={batsman1} 
                onChange={(e) => setBatsman1(e.target.value)}
                placeholder="Enter batsman 1 name"
                className="modal-input"
              />
            </div>
            
            <div className="modal-input-group">
              <label>Batsman 2:</label>
              <input 
                type="text" 
                value={batsman2} 
                onChange={(e) => setBatsman2(e.target.value)}
                placeholder="Enter batsman 2 name"
                className="modal-input"
              />
            </div>
            
            <div className="modal-buttons">
              <button 
                onClick={handleStartMatch}
                className="start-match-btn"
                disabled={!batsman1.trim() || !batsman2.trim()}
              >
                Continue Match
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wicket Modal */}
      {showWicketModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Wicket!</h2>
            <p><strong>{wicketBatsman}</strong> is out!</p>
            <p>Please enter the name of the next batsman.</p>
            
            <div className="modal-input-group">
              <label>Next Batsman:</label>
              <input 
                type="text" 
                value={nextBatsman} 
                onChange={(e) => setNextBatsman(e.target.value)}
                placeholder="Enter next batsman name"
                className="modal-input"
                autoFocus
              />
            </div>
            
            <div className="modal-buttons">
              <button 
                onClick={handleWicketReplacement}
                className="start-match-btn"
                disabled={!nextBatsman.trim()}
              >
                Continue Match
              </button>
            </div>
          </div>
        </div>
      )}

      <h1>Cricket (@Lampton ParK)</h1>
      
      {/* Tabbed Interface */}
      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
            onClick={() => setActiveTab('current')}
          >
            Current Over
          </button>
          <button 
            className={`tab-button ${activeTab === 'scorecard' ? 'active' : ''}`}
            onClick={() => setActiveTab('scorecard')}
          >
            Full Scorecard
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'current' && (
            <div className="current-over-tab">
              {/* Score Display */}
              <div className="score-display">
                <div className="score">
                  <h2>{score}/{wickets}</h2>
                  <p>Overs: {formatOvers()}</p>
                  <p>Extras: {extras}</p>
                </div>
              </div>
              
              <h3>Current Over Balls</h3>
              <div className="current-over-balls">
                {getCurrentOverBalls().map((ball, idx) => (
                  <span key={idx} className="current-ball">
                    {ball.result === 0 ? '.' : ball.result}
                  </span>
                ))}
                {getCurrentOverBalls().length === 0 && (
                  <p>No balls bowled in this over yet.</p>
                )}
              </div>

              {/* Player Details Display */}
              {(batsman1 || batsman2) && (
                <div className="player-details">
                  <div className={`player-info ${currentStriker === 1 ? 'current-striker' : ''}`}>
                    <span className="player-label">{batsman1}:</span>
                    <span className="player-name">{batsman1Runs}*</span>
                  </div>
                  <div className={`player-info ${currentStriker === 2 ? 'current-striker' : ''}`}>
                    <span className="player-label">{batsman2}:</span>
                    <span className="player-name">{batsman2Runs}</span>
                  </div>
                </div>
              )}

              {/* Scoring Buttons */}
              <div className="scoring-buttons">
                <div className="runs-buttons">
                  <h3>Runs</h3>
                  <div className="button-group">
                    <button onClick={() => handleRun(1)} className="run-btn">1</button>
                    <button onClick={() => handleRun(2)} className="run-btn">2</button>
                    <button onClick={() => handleRun(3)} className="run-btn">3</button>
                    <button onClick={() => handleRun(4)} className="run-btn">4</button>
                    <button onClick={() => handleRun(6)} className="run-btn">6</button>
                  </div>
                </div>
                
                <div className="extras-others-container">
                  <div className="extras-buttons">
                    <h3>Extras</h3>
                    <div className="button-group">
                      <button onClick={() => handleExtra('wide')} className="extra-btn wide">Wide</button>
                      <button onClick={() => handleExtra('noBall')} className="extra-btn no-ball">No Ball</button>
                    </div>
                  </div>
                  <div className="other-buttons">
                    <h3>Other</h3>
                    <div className="button-group">
                      <button onClick={handleWicket} className="wicket-btn">Wicket</button>
                      <button onClick={handleDot} className="dot-btn">Dot Ball</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'scorecard' && (
            <div className="scorecard-tab">
              {/* Batsman Statistics */}
              {(batsman1 || batsman2 || outBatsmen.length > 0) && (
                <div className="batsman-stats">
                  <h3>Batsman Statistics</h3>
                  <div className="batsman-list">
                    {/* Out Batsmen */}
                    {outBatsmen.map((batsman, index) => (
                      <div key={`out-${index}`} className="batsman-stat out-batsman">
                        <div className="batsman-info">
                          <span className="batsman-name">{batsman.name}</span>
                          <span className="batsman-score">{batsman.runs} ({batsman.balls})</span>
                        </div>
                        <div className="ball-details">
                          {batsman.ballDetails.join(', ')}
                        </div>
                      </div>
                    ))}
                    
                    {/* Current Batsmen */}
                    {batsman1 && !outBatsmen.find(b => b.name === batsman1) && (
                      <div className={`batsman-stat ${currentStriker === 1 ? 'current-striker' : ''}`}>
                        <div className="batsman-info">
                          <span className="batsman-name">{batsman1}</span>
                          <span className="batsman-score">{batsman1Runs}* ({getBatsmanBallsCount(batsman1)})</span>
                        </div>
                        <div className="ball-details">
                          {getCurrentBatsmanBallDetails(batsman1).join(', ')}
                        </div>
                      </div>
                    )}
                    {batsman2 && !outBatsmen.find(b => b.name === batsman2) && (
                      <div className={`batsman-stat ${currentStriker === 2 ? 'current-striker' : ''}`}>
                        <div className="batsman-info">
                          <span className="batsman-name">{batsman2}</span>
                          <span className="batsman-score">{batsman2Runs} ({getBatsmanBallsCount(batsman2)})</span>
                        </div>
                        <div className="ball-details">
                          {getCurrentBatsmanBallDetails(batsman2).join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="scorecard-table">
                <h3>Over by Over</h3>
                {getOversArray().map((over, idx) => (
                  <div key={idx} className="scorecard-over">
                    <span className="over-label">Over {idx + 1}:</span>
                    {over.map((ball, bIdx) => (
                      <span key={bIdx} className="scorecard-ball">{ball === 0 ? '.' : ball}</span>
                    ))}
                  </div>
                ))}
                {ballsHistory.length === 0 && <p>No balls bowled yet.</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="bottom-actions">
        <button onClick={resetMatch} className="reset-btn">Reset Match</button>
        <button onClick={handleEditPlayers} className="edit-players-btn">Edit Players</button>
      </div>
    </div>
  )
}

export default App
