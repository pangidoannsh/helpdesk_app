export default class Converter {
    static setToRowText(data: string, indikator?: string) {
        const splitData = data.split(indikator ? indikator : "<br/>");
        return splitData.map((data: any, index: number) => (
            <div key={index}>{data}</div>
        ))
    }
}