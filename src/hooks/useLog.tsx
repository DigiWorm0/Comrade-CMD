import { atom, useAtomValue, useSetAtom } from "jotai";
import React from "react";
import LogMessage, { LogLevel } from "../types/LogMessage";

const _log = atom<LogMessage[]>([]);
const putLog = atom(null, (get, set, msg: LogMessage) => {
    set(_log, (old) => [...old, msg]);
});

export function useLogData() {
    return useAtomValue(_log);
}

export function useLog() {
    return useSetAtom(putLog);
}


export default function useLogSuccess() {
    const log = useLog();
    return React.useCallback((text: string) => {
        log({
            timestamp: Date.now(),
            level: LogLevel.Success,
            text,
        });
    }, [log]);
}

export function useLogInfo() {
    const log = useLog();
    return React.useCallback((text: string) => {
        log({
            timestamp: Date.now(),
            level: LogLevel.Info,
            text,
        });
    }, [log]);
}

export function useLogWarn() {
    const log = useLog();
    return React.useCallback((text: string) => {
        log({
            timestamp: Date.now(),
            level: LogLevel.Warn,
            text,
        });
    }, [log]);
}

export function useLogError() {
    const log = useLog();
    return React.useCallback((text: string) => {
        log({
            timestamp: Date.now(),
            level: LogLevel.Error,
            text,
        });
    }, [log]);
}