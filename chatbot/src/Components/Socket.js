import { Component } from 'react';
import { Loading } from 'react-simple-chatbot'
import PropTypes from 'prop-types';
import io from 'socket.io-client';

class Socket extends Component {
    constructor(props) {
        super(props);

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

    componentWillMount() {
        const { steps } = this.props;
        const search = steps.search.value;
        const self = this

        this.utter(search)

        self.socket.on('bot_uttered', function (response) {
            console.log('Bot uttered:', response);
            if (response.text) {
                self.setState({ loading: false, result: response.text })
            }

            if (self.enableTTS) {
                var msg = new SpeechSynthesisUtterance()
                msg.text = response.text
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
            <div className="dbpedia" >
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