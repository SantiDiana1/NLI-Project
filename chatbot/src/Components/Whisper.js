import { useWhisper } from '@chengsokdara/use-whisper'

const Whisper = () => {
    const {
        recording,
        speaking,
        transcribing,
        transcript,
        pauseRecording,
        startRecording,
        stopRecording,
    } = useWhisper({
        apiKey: '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', // YOUR_OPEN_AI_TOKEN
    })

    return (
        <div>
            <p>Recording: {recording}</p>
            <p>Speaking: {speaking}</p>
            <p>Transcribing: {transcribing}</p>
            <p>Transcribed Text: {transcript.text}</p>
            <button onClick={() => startRecording()}>Start</button>
            <button onClick={() => pauseRecording()}>Pause</button>
            <button onClick={() => stopRecording()}>Stop</button>
        </div>
    )
}

export default Whisper