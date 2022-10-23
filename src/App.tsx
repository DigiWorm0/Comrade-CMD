import React from 'react';
import { _useBTComms } from './hooks/useBluetooth';
import { _useGamepads } from './hooks/useGamepads';
import MainPanel from './panels/MainPanel';
import SidePanel from './panels/SidePanel';

function App() {
    _useGamepads();
    _useBTComms();

    return (
        <div
            className="bp4-dark"
            style={{
                display: 'flex',
                flexDirection: 'row',

                height: '100vh',
                width: '100vw',
            }}>

            <SidePanel />
            <MainPanel />

        </div>
    );
}

export default App;
