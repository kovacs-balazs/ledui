import React from "react";

function RealKobaHorizontalLine() {
    return (
        <div className="max-w-150 w-[90%] mx-auto border-3 border-blue-800 rounded-full" />
    )
}

const KobaHorizontalLine = React.memo(RealKobaHorizontalLine);
export default KobaHorizontalLine;