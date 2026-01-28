const TotalsDisplay = ({ totals }) => {
    return (
        <div className="dashboard-stats-grid">
            {}
            <div className="dashboard-stat-card stat-card-total">
                <div className="stat-card-content">
                    <div className="stat-label">TOTAL EXPENSES</div>
                    <div className="stat-value-large">
                        ₹{Number(totals.total || 0).toFixed(2)}
                    </div>
                </div>
                <div className="stat-card-icon-svg">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                    </svg>
                </div>
            </div>

            {}
            <div className="dashboard-stat-card stat-card-today">
                <div className="stat-card-content">
                    <div className="stat-label">TODAY'S EXPENSES</div>
                    <div className="stat-value-large">
                        ₹{Number(totals.total_today || 0).toFixed(2)}
                    </div>
                </div>
                <div className="stat-card-icon-svg">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
                    </svg>
                </div>
            </div>

            {}
            <div className="dashboard-stat-card stat-card-month">
                <div className="stat-card-content">
                    <div className="stat-label">THIS MONTH</div>
                    <div className="stat-value-large">
                        ₹{Number(totals.total_month || 0).toFixed(2)}
                    </div>
                </div>
                <div className="stat-card-icon-svg">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default TotalsDisplay;
