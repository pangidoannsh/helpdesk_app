export default class Converter {
    static stringToElement(data: string) {
        const splitData = data.split("<br/>");
        return splitData.map((data: any, index: number) => (
            <div key={index}>{data}</div>
        ))
    }
}