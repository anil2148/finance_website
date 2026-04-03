import React from 'react';

const EmiCalculator = ({ isIndiaCurrency }) => {
    const principal = isIndiaCurrency ? 5000000 : 350000;
    const rate = isIndiaCurrency ? 8 : 6.8;
    const years = isIndiaCurrency ? 20 : 30;

    // Other calculator logic

    const title = isIndiaCurrency ? 'Home Loan EMI Calculator (India)' : 'Home Loan EMI Calculator';

    return (
        <div>
            <h1>{title}</h1>
            {/* Other components */}
        </div>
    );
};

export default EmiCalculator;