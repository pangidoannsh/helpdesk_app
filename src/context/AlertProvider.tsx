import Alert from '@/components/ui/Alert';
import React, { ReactNode, useState } from 'react'

interface Alert {
    isActived: boolean;
    code: number;
    title: string;
    message: string;
}
interface AlertContextProps {
    alert: Alert,
    setAlert: (alert: Alert) => void;
    closeAlert: any
}
export const AlertContext = React.createContext<AlertContextProps>({
    alert: { isActived: false, code: 0, title: '', message: '' },
    setAlert: () => { },
    closeAlert: () => { }
});

const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [alert, setAlert] = useState<Alert>({ isActived: false, code: 0, title: '', message: '' });
    function closeAlert() {
        setAlert(prev => ({ ...prev, isActived: false }));
    }
    return (
        <AlertContext.Provider value={{ alert, setAlert, closeAlert }}>
            {children}
            <Alert {...alert} setAlert={setAlert} />
        </AlertContext.Provider>
    )
}

export default AlertProvider