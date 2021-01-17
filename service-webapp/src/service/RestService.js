import {ajax} from 'rxjs/observable/dom/ajax';

const RETRY_ATTEMPTS_COUNT = 4;
const RETRY_DELAY = 1000;

export default class RestService {
    static get(path, retry = false) {
        return ajax.getJSON(path)
            .retryWhen(errors => {
                return errors.scan((errorCount, err) => {
                    if (errorCount >= RETRY_ATTEMPTS_COUNT || !retry) {
                        throw err;
                    }
                    return errorCount + 1;
                }, 0)
                    .delay(RETRY_DELAY)
            })
    }

    static delete(path) {
        return ajax.delete(path);
    }

    static post(path, body) {
        return ajax.post(path, body, {'Content-Type': 'application/json'})
            .map(response => response.response)
    }

    static put(path, body) {
        return ajax.put(path, body, {'Content-Type': 'application/json'})
            .map(response => response.response)
    }
}

