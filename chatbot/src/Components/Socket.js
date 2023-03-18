import { Component } from 'react';
import { Loading } from 'react-simple-chatbot'
import PropTypes from 'prop-types';
import io from 'socket.io-client';

class Socket extends Component {
    constructor(props) {
        super(props);

        this.apiKey = 'trnsl.1.1.20230318T211359Z.e0a23172c73f602b.24d06256bc5dce3bfd7973c8cb3526219212d57e'

        this.language = this.props.language

        this.enableTTS = this.props.enableTTS

        this.socket = io('http://localhost:5005')

        this.state = {
            loading: true,
            result: '',
            trigger: false,
        };

        const self = this
        self.socket.on('connect', function () {
            console.log('Connected to Socket.io server.');
            self.socket.emit('session_request', {
                'session_id': self.getSessionId(),
            });
            console.log(`Session ID: ${self.getSessionId()}`);
        });

        self.socket.on('connect_error', (error) => {
            // Write any connection errors to the console
            console.error(error);
            self.setState({ loading: false, result: "Sorry I'm too tired to respond, check back later 😴" })
        });

    }

    translateText = async (text, sourceLang, targetLang) => {
        const response = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${this.apiKey}&text=${text}&lang=${sourceLang}-${targetLang}`)
        const data = await response.json()
        return data.text[0]
    }

    async componentDidMount() {
        const { steps } = this.props;
        var search = steps.search.value;
        const self = this

        if (this.language !== 'English') {
            search = await this.translateText(search, 'es', 'en')
        }

        this.utter(search)

        self.socket.on('bot_uttered', async function (response) {
            console.log('Bot uttered:', response);
            var result = response.text
            if (this.language !== 'English') {
                result = await self.translateText(result, 'en', 'es')
            }
            if (result) {
                self.setState({ loading: false, result: result })
            }

            if (self.enableTTS) {
                var msg = new SpeechSynthesisUtterance()
                msg.text = result
                window.speechSynthesis.speak(msg)
            }
        });
    }


    componentDidUpdate() {
        if (!this.state.trigger) {
            this.setState({ trigger: true }, () => {
                this.props.triggerNextStep();
            })
        }
    }

    getSessionId = () => {
        const storage = localStorage;
        const storageKey = 'RASA_SESSION_ID';
        const savedId = storage.getItem(storageKey);
        if (savedId) {
            return savedId;
        }
        const newId = this.socket.id;
        storage.setItem(storageKey, newId);
        return newId;
    }

    utter = (msg) => {
        this.socket.emit('user_uttered', {
            'message': msg,
            'session_id': this.getSessionId(),
        });
    }

    render() {
        const { trigger, loading, result } = this.state;

        return (
            <div className="socket" >
                {loading ? <Loading /> : result}
                {
                    !loading &&
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: 20,
                        }}
                    >
                    </div>
                }
            </div>
        );
    }
}

Socket.propTypes = {
    steps: PropTypes.object,
    triggerNextStep: PropTypes.func,
};

Socket.defaultProps = {
    steps: undefined,
    triggerNextStep: undefined,
};

export default Socket