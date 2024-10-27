import React, { useState, useEffect } from 'react';
import './TWN.css';
import Loader from '../../../../utilities/Loader/Loader';
import CompetitionImage from '../../../../assets/CompetitionImage.png';

function TWN() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [competitions, setCompetitions] = useState([]);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [winners, setWinners] = useState([]);
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        setShowLoading(true);
        const fetchCompetitions = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/getLiveCompetition`);
                const data = await response.json();
                setShowLoading(false);
                setCompetitions(data);
            } catch (error) {
                setShowLoading(false);
                console.log('Error fetching competitions:', error);
            }
        };

        fetchCompetitions();
    }, []);

    const handleShowWinners = async (competitionId) => {
        try {
            setShowLoading(true);
            const response = await fetch(`${apiUrl}/api/assignsWinners/${competitionId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            setShowLoading(false);
            setWinners(data);
            setSelectedCompetition(competitionId);
        } catch (error) {
            setShowLoading(false);
            console.log('Error fetching winners:', error);
        }
    };

    const handleBackToCards = () => {
        setSelectedCompetition(null);
        setWinners([]);
    };

    return (
        <div className="winners-container">
            {showLoading ? (
                <Loader content={"Loading Winners Result..."} />
            ) : (
                <>
                    {selectedCompetition === null ? (
                        <div className="competition-cards-container">
                            <h2>Select Competition</h2>
                            <hr />
                            <div className="competition-cards-container-section">
                                {competitions.length > 0 ? (
                                    competitions.map((competition, index) => (
                                        <div className="live-competion-card-result" key={competition._id}>
                                            <div className="live-competion-card-img-result">
                                                <img src={CompetitionImage} alt="Competition" />
                                            </div>
                                            <div className="live-competion-card-content">
                                                <h3>{competition.competitionName}</h3>
                                                <div className="small_text">Rounds {competition.rounds.length}</div>
                                                <p className="small_text">{competition.lastSaved}</p>
                                                <div className="live-competion-card-button">
                                                    <button onClick={() => handleShowWinners(competition._id)}>Show Winners</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="default">No live competitions available.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="winners-page">
                            <button className="TWN-back-button" onClick={handleBackToCards}>Back</button>
                            <h2>Winners of {competitions.find(c => c._id === selectedCompetition).competitionName}</h2>
                            {winners.winner ? (
                                <div className="winners-stage">
                                    <div className="winner-item first-place">
                                        <div className="trophy-icon">🏆</div>
                                        <h3>1</h3>
                                        <p>{winners.winner}</p>
                                    </div>
                                    <div className="winner-item second-place">
                                        <div className="trophy-icon">🥈</div>
                                        <h3>2</h3>
                                        <p>{winners.runnerUp}</p>
                                    </div>
                                    <div className="winner-item third-place">
                                        <div className="trophy-icon">🥉</div>
                                        <h3>3</h3>
                                        <p>{winners.secondRunnerUp}</p>
                                    </div>
                                </div>
                            ) : (
                                <p>No winners declared yet.</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default TWN;
