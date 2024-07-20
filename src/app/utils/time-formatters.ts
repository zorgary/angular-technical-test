export function formatDuration(seconds: number): string {
    // Calcula los minutos y segundos
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Formatea minutos y segundos con ceros a la izquierda si es necesario
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = remainingSeconds.toString().padStart(2, '0');

    // Retorna el formato "MM:SS"
    return `${minutesStr}:${secondsStr}`;
}
