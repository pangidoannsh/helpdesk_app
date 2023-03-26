export default class MessageManager {
    static clearQuote(text: string) {
        const removeTitle = text.replace("MENGUTIP :", '');
        const removeContent = removeTitle.replace(/".*?"\s*/, '');
        return removeContent.replaceAll("\n", '');
    }
}