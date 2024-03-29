import { parseISO, format } from "date-fns";

export default class Converter {
    static setToRowText(data: string, indikator?: string) {
        const splitData = data.split(indikator ? indikator : "<br/>");
        return splitData.map((data: any, index: number) => (
            <div key={index}>{data}</div>
        ))
    }

    static dateToMMformat(date: string) {
        return format(parseISO(date), 'dd/MM/yyyy HH:m');
    }
    static dateToMMMMformat(date: string, reverse?: boolean) {
        if (reverse) {
            return format(parseISO(date), 'dd MM yyyy HH:m');
        }
        return format(parseISO(date), 'HH:m dd MM yyyy');
    }

}