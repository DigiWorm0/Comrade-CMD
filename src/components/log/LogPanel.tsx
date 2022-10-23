import { Callout, InputGroup, NonIdealState } from "@blueprintjs/core";
import React from "react";
import { useLogData, useLogInfo } from "../../hooks/useLog";
import { LogLevel } from "../../types/LogMessage";
import LogLevelToIntent from "../../util/LogLevelToIntent";

export default function LogPanel() {
    const logData = useLogData();
    const logInfo = useLogInfo();

    React.useEffect(() => {
        const logScroller = document.getElementById("log-scroller");
        if (logScroller) {
            logScroller.scrollTop = logScroller.scrollHeight;
        }
    }, [logData]);

    const sendCommand = React.useCallback((command: string) => {
        logInfo("Sending command:\n" + command);
    }, [logInfo]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            justifyContent: 'end',

            height: '100vh',
            width: '100%'
        }} >
            <div
                id="log-scroller"
                style={{
                    overflowY: 'auto',
                    overflowX: 'hidden',

                    height: '100%',
                    width: '100%'
                }}>
                {logData.length <= 0 && (
                    <NonIdealState
                        icon="console"
                        title="No Data Recieved"
                        description="Connect to the robot and console output will appear here."
                    />
                )}
                {logData.map((msg, i) => (
                    <Callout
                        intent={LogLevelToIntent(msg.level)}
                        icon={msg.level === LogLevel.Info ? "comment" : undefined}
                        key={i}
                    >
                        {msg.text.split("\n").map((line, lineNum) => {
                            return (
                                <span key={lineNum}>
                                    {lineNum % 2 === 1 ? <code>{line}</code> : line}
                                    <br />
                                </span>
                            );
                        })}
                    </Callout>
                ))}
            </div>
            <div style={{
                width: '100%',
            }}>
                <InputGroup
                    fill
                    large
                    leftIcon="chevron-right"
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            sendCommand(e.currentTarget.value);
                            e.currentTarget.value = "";
                        }
                    }}
                />
            </div>
        </div >
    );

}