import { toast } from 'react-toastify';
import io from 'socket.io-client';
import game from './game/Game';
import history from './history';

class Socket {
    constructor() {
        this.uuid = sessionStorage.getItem('uuid');
        this.ignoreDisconnect = false;
        this.socket = null;
    }

    init() {
        if (this.socket !== null && this.isConnected()) { 
            // We do not need to redo the connection if we're still connected.
            return;
        }
        
        this.socket = io(process.env.REACT_APP_SOCKET_URL, { path: process.env.REACT_APP_SOCKET_CONTEXT_PATH });
        this.registerServerEvents();   
    }

    registerServerEvents() {
        this.clearServerEvents();
        this.socket.on('error', console.error);

        // If the server requests the UUID send it.
        this.socket.on('send-uuid', () => {
            this.socket.emit('uuid', { id: this.uuid });
        });
        // Save given UUID
        this.socket.on('uuid', (uuidHolder) => {
            this.uuid = uuidHolder.id;
            sessionStorage.setItem('uuid', this.uuid);
        });

        this.on('lobby-create-result', (data) => {
            if (!data.success) {
                toast.error(data.message);
                return;
            }
            sessionStorage.setItem('lobbyCode', data.code);
            history.push({ pathname: '/game/' + data.code, state: { connected: true } });
        });

        this.on('lobby-join-result', (data) => {
            if (!data.success) {
                toast.error(data.message);
                return;
            }
            game.reset();
            sessionStorage.setItem('lobbyCode', data.code);
            history.push({ pathname: '/game/' + data.code, state: { connected: true } });
        });

        this.on('lobby-reconnect', (data) => {
            if (!data.success) {
                toast.error(data.message);
                return;
            }
            sessionStorage.setItem('lobbyCode', data.code);
            history.push({ pathname: '/game/' + data.code, state: { connected: true } });
        });

        this.on('lobby-add-ai-result', (data) => {
            if (!data.success) {
                toast.error(data.message);
                return;
            }
        });

        this.on('lobby-player-joined', (data) => {
            game.setPlayers(data.players);
        });

        this.on('lobby-player-left', (data) => {
            game.setPlayers(data.players);
        });

        this.socket.emit('uuid', { id: this.uuid });
    }

    clearServerEvents() {
        this.socket.off('error');
        this.socket.off('send-uuid');
        this.socket.off('uuid');
        this.socket.off('lobby-join-result');
        this.socket.off('lobby-create-result');
        this.socket.off('lobby-reconnect');
        this.socket.off('lobby-player-joined');
        this.socket.off('lobby-player-left');
        this.socket.off('lobby-add-ai-result');
    }

    clearUuid() {
        sessionStorage.removeItem('uuid');
        this.uuid = null;
    }

    /* Socket Funcs */

    isConnected() {
        return this.socket.connected;
    }

    reconnect() {
        const oldUuid = this.uuid;
        this.clearUuid();
        this.socket.emit('reset-uuid', oldUuid);
    }

    disconnect() {
        this.socket.disconnect();
    }

    on(path, callback) {
        this.socket.on(path, callback);
    }

    emit(path, data) {
        this.socket.emit(path, data);
    }

    /* Misc Funcs */
    createSession() {
        this.socket.emit('lobby-create-action');
    }

    addAi() {
        this.socket.emit('lobby-add-ai-action');
    }

    joinSession(code) {
        this.socket.emit('lobby-join-action', { code });
    }

    leaveSession() {
        this.socket.emit('lobby-leave-action');
    }
}

const socket = new Socket();
export default socket;
