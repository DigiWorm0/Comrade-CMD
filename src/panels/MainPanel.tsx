import LogPanel from "../components/log/LogPanel";

export default function MainPanel() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',

            height: '100vh',
            width: '100%'
        }} >

            <LogPanel />

        </div >
    );
}