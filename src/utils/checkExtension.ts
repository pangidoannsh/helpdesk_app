export default function checkExtension(fileName: string, extensionPromises: Array<string>) {
    return extensionPromises.findIndex(ext => fileName.includes(ext)) !== -1;
}